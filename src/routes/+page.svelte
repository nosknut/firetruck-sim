<script lang="ts">
	import Firetruck from '$lib/components/Firetruck.svelte';
	import Road from '$lib/components/Road.svelte';
	import { createVehicleState } from '$lib/helpers/createVehicleState';
	import VehiclePhysics from '$lib/components/VehiclePhysics.svelte';
	import { pins, simPins } from '$lib/stores/pins';
	import { serialPort } from '$lib/stores/serial';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import SerialConnectButton from '$lib/components/SerialConnectButton.svelte';
	import ControlsPanel from '$lib/components/ControlsPanel.svelte';
	import Controls from '$lib/components/Controls.svelte';
	import Joystick from '$lib/components/Joystick.svelte';
	import PinRegistry from '$lib/components/PinRegistry.svelte';
	import SerialMonitor from '$lib/components/SerialMonitor.svelte';
	import Slider from '$lib/components/Slider.svelte';
	import StopButton from '$lib/components/StopButton.svelte';
	import { onDestroy } from 'svelte';
	import NumberToggle from '$lib/components/NumberToggle.svelte';
	import { writable } from 'svelte/store';
	import { Canvas } from '@threlte/core';
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	const GAS_PEDAL_PIN = 1;
	const DIRECTION_PICKER_PIN = 2;
	const SPEED_SENSOR_PIN = 3;
	const DIRECTION_PIN = 4;
	const MOTOR_POWER_PIN = 5;
	const SPEEDOMETER_PIN = 6;

	// Used because the truck speed is technically a cyclical dependency
	const truckSpeed = writable(0);

	let joyStickY = 0;

	// Only update direction if the joystick is being used
	$: {
		$pins[GAS_PEDAL_PIN] = Math.round(Math.abs(joyStickY) * 255);
		$pins[DIRECTION_PICKER_PIN] = Number(joyStickY >= 0);
	}

	// Start with direction forward
	$pins[DIRECTION_PICKER_PIN] = 1;

	let truckStates = [createVehicleState(), createVehicleState(), createVehicleState()];

	truckStates.forEach((state, i) => {
		state.state.transform.position.x = i * 5 - 5;
		state.state.transform.position.z = i * 7 - 5;
	});

	let truck = truckStates[0];
	truck.state.transform.rotation.y = Math.PI;
	$: truck.state.speed = $truckSpeed;

	$: directionIndicator =
		$pins[DIRECTION_PIN] === undefined ? 'N/A' : $pins[DIRECTION_PIN] ? 'Forward' : 'Backward';

	$simPins.add(SPEED_SENSOR_PIN.toString());
	onDestroy(() => $simPins.delete(SPEED_SENSOR_PIN.toString()));
	$: $pins[SPEED_SENSOR_PIN] = Math.round(Math.abs($truckSpeed) * 255);

	onDestroy(
		// In a subscription because this is a cyclical dependency
		pins.subscribe((pins) => {
			let direction = pins[DIRECTION_PIN] ? 1 : -1;
			truckSpeed.set((direction * ($pins[MOTOR_POWER_PIN] || 0)) / 255);
		})
	);

	function stopTruck() {
		$pins[GAS_PEDAL_PIN] = 0;
	}
</script>

<PageLayout>
	<div slot="nav-actions" class="flex gap-2">
		<SerialConnectButton />
	</div>

	<div class="flex flex-row h-full w-full">
		<div class="w-96 resize-x overflow-x-auto">
			<ControlsPanel>
				{#if $serialPort.isOpen}
					<Controls open label="Serial Monitor">
						<SerialMonitor />
					</Controls>
					<Controls open label="Firetruck 1 Serial Controls">
						<NumberToggle bind:checked={$pins[DIRECTION_PICKER_PIN]} label="Direction" />
						<div class="my-2">
							<div class="flex justify-between">
								Direction: <div>{directionIndicator}</div>
							</div>
							<div class="flex justify-between">
								Speedometer: <div>{$pins[SPEEDOMETER_PIN] ?? 'N/A'}</div>
							</div>
							<div class="flex justify-between">
								Power: <div>{$pins[MOTOR_POWER_PIN] ?? 'N/A'}</div>
							</div>
						</div>
						<Slider
							bind:value={$pins[GAS_PEDAL_PIN]}
							min={0}
							max={255}
							step={1}
							numDigits={0}
							label="Gas Pedal"
						/>
						<Slider bind:value={truck.state.turn} min={-1} max={1} label="Turn" />
						<StopButton on:click={stopTruck} />
						<Joystick bind:x={truck.state.turn} bind:y={joyStickY} />
					</Controls>
					<Controls open label="Pin Registry" topPadding={6}>
						<PinRegistry />
					</Controls>
				{:else}
					<Controls label="Firetruck 1 Controls">
						Connect a controller to use this truck.
						<SerialConnectButton large />
					</Controls>
				{/if}
				{#each truckStates as { state, stop }, i}
					{#if i > 0}
						<Controls label="Firetruck {i + 1} Controls">
							<Slider bind:value={state.speed} min={-1} max={1} label="Speed" />
							<Slider bind:value={state.turn} min={-1} max={1} label="Turn" />
							<StopButton on:click={stop} />
							<Joystick bind:x={state.turn} bind:y={state.speed} />
						</Controls>
					{/if}
				{/each}
			</ControlsPanel>
		</div>
		<div class="w-full">
			<Canvas>
				<Road />
				{#each truckStates as { state }}
					<VehiclePhysics profile={{ maxSpeed: 1, maxTurnAngle: 30 }} bind:state />
					<Firetruck bind:state />
				{/each}
				<T.PerspectiveCamera zoom={0.5} position={[-10, 10, 10]} makeDefault>
					<OrbitControls enableDamping />
				</T.PerspectiveCamera>
				<T.AmbientLight />
				<T.DirectionalLight position={[10, 10, 5]} />
			</Canvas>
		</div>
	</div>
</PageLayout>
