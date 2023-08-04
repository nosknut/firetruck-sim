<script lang="ts">
	import Firetruck from '$lib/components/Firetruck.svelte';
	import { createVehicleState } from '$lib/helpers/createVehicleState';
	import VehiclePhysics from '$lib/components/VehiclePhysics.svelte';
	import { serialPort } from '$lib/stores/serial';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import SerialConnectButton from '$lib/components/SerialConnectButton.svelte';
	import FiretruckControls from '$lib/components/FiretruckControls.svelte';
	import ControlsPanel from '$lib/components/ControlsPanel.svelte';
	import Controls from '$lib/components/Controls.svelte';
	import Joystick from '$lib/components/Joystick.svelte';
	import PinRegistry from '$lib/components/PinRegistry.svelte';
	import SerialMonitor from '$lib/components/SerialMonitor.svelte';
	import Slider from '$lib/components/Slider.svelte';
	import StopButton from '$lib/components/StopButton.svelte';
	import { Canvas } from '@threlte/core';
	import { T } from '@threlte/core';
	import { OrbitControls, Suspense } from '@threlte/extras';
	import Measured from '$lib/components/Measured.svelte';
	import ToggleWithLabel from '$lib/components/ToggleWithLabel.svelte';
	import {
		motorPowerPin,
		directionPin,
		gasPedalPin,
		directionPickerPin,
		boomUpPickerPin,
		boomDownPickerPin,
		boomLeftPickerPin,
		boomRightPickerPin,
		speedSensorPin,
		wiperPin,
		headlightPin,
		flashLeftPin,
		flashRightPin,
		boomRotationPin,
		boomElevationPin,
		boomElbowPin,
		boomWristPin,
		headlightPickerPin,
		flashLeftPickerPin,
		flashRightPickerPin,
		wiperPickerPin,
		boomElbowInPickerPin,
		boomElbowOutPickerPin,
		speedometerPin
	} from '$lib/stores/firetruckPins';
	import City from '$lib/components/models/City.svelte';

	let joyStickY = 0;

	let boomJoyStick = {
		x: 0,
		y: 0
	};

	let truck = createVehicleState();
	let truckStates = [truck, createVehicleState(), createVehicleState()];

	truckStates.forEach((state, i) => {
		state.update((s) => {
			s.transform.position.x = i * 5 - 5;
			s.transform.position.z = i * 7 - 5;
			return s;
		});
	});

	$truck.transform.rotation.y = Math.PI;

	$: {
		let direction = $directionPin.boolValue ? 1 : -1;
		$truck.speed = (direction * $motorPowerPin.numberValue) / 255;
	}

	$: directionIndicator =
		$directionPin.mode === undefined ? 'N/A' : $directionPin.boolValue ? 'Forward' : 'Backward';

	// Write to controller inputs
	$: $gasPedalPin.numberValue = Math.round(Math.abs(joyStickY) * 255);
	$: $directionPickerPin.boolValue = joyStickY >= 0;
	$: $boomUpPickerPin.boolValue = boomJoyStick.y == 1;
	$: $boomDownPickerPin.boolValue = boomJoyStick.y == -1;
	$: $boomLeftPickerPin.boolValue = boomJoyStick.x == -1;
	$: $boomRightPickerPin.boolValue = boomJoyStick.x == 1;
	$: $speedSensorPin.numberValue = Math.round(Math.abs($truck.speed) * 255);

	// Read from controller outputs
	$: $truck.wiper = $wiperPin.numberValue / 255;
	$: $truck.lights.headlights = $headlightPin.boolValue;
	$: $truck.lights.flash.left = $flashLeftPin.boolValue;
	$: $truck.lights.flash.right = $flashRightPin.boolValue;
	$: $truck.boom.rotation = $boomRotationPin.numberValue / 255;
	$: $truck.boom.elevation = $boomElevationPin.numberValue / 255;
	$: $truck.boom.elbow = $boomElbowPin.numberValue / 255;
	$: $truck.boom.wrist = $boomWristPin.numberValue / 255;

	function stopTruck() {
		$gasPedalPin.numberValue = 0;
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
							<ToggleWithLabel bind:checked={$directionPickerPin.boolValue} label="Direction" />
							<ToggleWithLabel bind:checked={$headlightPickerPin.boolValue} label="Headlights" />
							<ToggleWithLabel bind:checked={$flashLeftPickerPin.boolValue} label="Flash Left" />
							<ToggleWithLabel bind:checked={$flashRightPickerPin.boolValue} label="Flash Right" />
							<ToggleWithLabel bind:checked={$wiperPickerPin.boolValue} label="Wipers" />
							<ToggleWithLabel bind:checked={$boomUpPickerPin.boolValue} label="Boom Up" />
							<ToggleWithLabel bind:checked={$boomDownPickerPin.boolValue} label="Boom Down" />
							<ToggleWithLabel bind:checked={$boomLeftPickerPin.boolValue} label="Boom Left" />
							<ToggleWithLabel bind:checked={$boomRightPickerPin.boolValue} label="Boom Right" />
							<ToggleWithLabel
								bind:checked={$boomElbowInPickerPin.boolValue}
								label="Boom Elbow In"
							/>
							<ToggleWithLabel
								bind:checked={$boomElbowOutPickerPin.boolValue}
								label="Boom Elbow Out"
							/>
						</div>
						<div class="my-2">
							<div class="flex justify-between">
								Direction: <div>{directionIndicator}</div>
							</div>
							<div class="flex justify-between">
								Speedometer: <div>
									{$speedometerPin.mode === undefined ? 'N/A' : $speedometerPin.numberValue}
								</div>
							</div>
							<div class="flex justify-between">
								Power: <div>
									{$motorPowerPin.mode === undefined ? 'N/A' : $motorPowerPin.numberValue}
								</div>
							</div>
						</div>
						<Slider
							bind:value={$gasPedalPin.numberValue}
							min={0}
							max={255}
							step={1}
							numDigits={0}
							label="Gas Pedal"
						/>
						<Slider bind:value={$truck.turn} min={-1} max={1} label="Turn" />
						<StopButton on:click={stopTruck} />
						<div class="flex">
							<Joystick bind:x={$truck.turn} bind:y={joyStickY} label="Drive" />
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
				{#each truckStates as state, i}
					{#if i > 0}
						<Controls label="Firetruck {i + 1} Controls">
							<FiretruckControls bind:state />
						</Controls>
					{/if}
				{/each}
			</ControlsPanel>
		</div>
		<div class="w-full overflow-auto bg-gray-300 dark:bg-gray-600">
			<Measured let:height let:width>
				<Canvas size={{ height, width }}>
					<Suspense>
						<City />
					</Suspense>
					{#each truckStates as state}
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
