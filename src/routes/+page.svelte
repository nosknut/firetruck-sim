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
	import Measured from '$lib/components/Measured.svelte';

	const GAS_PEDAL_PIN = 1;
	const DIRECTION_PICKER_PIN = 2;
	const SPEED_SENSOR_PIN = 3;
	const DIRECTION_PIN = 4;
	const MOTOR_POWER_PIN = 5;
	const SPEEDOMETER_PIN = 6;

	const HEADLIGHTS_PICKER_PIN = 7;
	const HEADLIGHTS_PIN = 8;

	const FLASH_LEFT_PICKER_PIN = 9;
	const FLASH_LEFT_PIN = 10;

	const FLASH_RIGHT_PICKER_PIN = 11;
	const FLASH_RIGHT_PIN = 12;

	const WIPER_PICKER_PIN = 13;
	const WIPER_PIN = 14;

	const BOOM_UP_PICKER_PIN = 15;
	const BOOM_DOWN_PICKER_PIN = 16;
	const BOOM_ELEVATION_PIN = 18;

	const BOOM_LEFT_PICKER_PIN = 19;
	const BOOM_RIGHT_PICKER_PIN = 20;
	const BOOM_ROTATION_PIN = 22;

	// Used because the truck speed is technically a cyclical dependency
	const truckSpeed = writable(0);

	let joyStickY = 0;

	let boomJoyStick = {
		x: 0,
		y: 0
	};

	// Only update direction if the joystick is being used
	$: {
		$pins[GAS_PEDAL_PIN] = Math.round(Math.abs(joyStickY) * 255);
		$pins[DIRECTION_PICKER_PIN] = Number(joyStickY >= 0);
	}

	$: $pins[BOOM_UP_PICKER_PIN] = Number(boomJoyStick.y == 1);
	$: $pins[BOOM_DOWN_PICKER_PIN] = Number(boomJoyStick.y == -1);
	$: $pins[BOOM_LEFT_PICKER_PIN] = Number(boomJoyStick.x == -1);
	$: $pins[BOOM_RIGHT_PICKER_PIN] = Number(boomJoyStick.x == 1);

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

	$: truck.state.wiper = Number($pins[WIPER_PIN] ?? 0) / 255;
	$: truck.state.lights.headlights = Boolean($pins[HEADLIGHTS_PIN]);
	$: truck.state.lights.flash.left = Boolean($pins[FLASH_LEFT_PIN]);
	$: truck.state.lights.flash.right = Boolean($pins[FLASH_RIGHT_PIN]);
	$: truck.state.boom.rotation = Number($pins[BOOM_ROTATION_PIN] ?? 0) / 255;
	$: truck.state.boom.elevation = Number($pins[BOOM_ELEVATION_PIN] ?? 0) / 255;

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
						<div class="flex flex-wrap gap-4">
							<NumberToggle bind:checked={$pins[DIRECTION_PICKER_PIN]} label="Direction" />
							<NumberToggle bind:checked={$pins[HEADLIGHTS_PICKER_PIN]} label="Headlights" />
							<NumberToggle bind:checked={$pins[FLASH_LEFT_PICKER_PIN]} label="Flash Left" />
							<NumberToggle bind:checked={$pins[FLASH_RIGHT_PICKER_PIN]} label="Flash Right" />
							<NumberToggle bind:checked={$pins[WIPER_PICKER_PIN]} label="Wipers" />
							<NumberToggle bind:checked={$pins[BOOM_UP_PICKER_PIN]} label="Boom Up" />
							<NumberToggle bind:checked={$pins[BOOM_DOWN_PICKER_PIN]} label="Boom Down" />
							<NumberToggle bind:checked={$pins[BOOM_LEFT_PICKER_PIN]} label="Boom Left" />
							<NumberToggle bind:checked={$pins[BOOM_RIGHT_PICKER_PIN]} label="Boom Right" />
						</div>
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
						<div class="flex">
							<Joystick bind:x={truck.state.turn} bind:y={joyStickY} label="Drive" />
							<Joystick bind:x={boomJoyStick.x} bind:y={boomJoyStick.y} label="Boom" />
						</div>
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
							<Slider
								bind:value={state.boom.elevation}
								min={0}
								max={1}
								step={0.01}
								label="Boom Elevation"
							/>
							<Slider
								bind:value={state.boom.rotation}
								min={-1}
								max={1}
								step={0.01}
								label="Boom Rotation"
							/>
							<StopButton on:click={stop} />
							<Joystick bind:x={state.turn} bind:y={state.speed} />
						</Controls>
					{/if}
				{/each}
			</ControlsPanel>
		</div>
		<div class="w-full overflow-auto bg-black">
			<Measured let:height let:width>
				<Canvas size={{ height, width }}>
					<Road />
					{#each truckStates as { state }}
						<Firetruck bind:state />
						<VehiclePhysics profile={{ maxSpeed: 1, maxTurnAngle: 30 }} bind:state />
					{/each}
					<T.PerspectiveCamera zoom={0.5} position={[-10, 10, 10]} makeDefault>
						<OrbitControls />
					</T.PerspectiveCamera>
					<T.AmbientLight />
				</Canvas>
			</Measured>
		</div>
	</div>
</PageLayout>
