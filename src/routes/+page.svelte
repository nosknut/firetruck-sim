<script lang="ts">
	import Firetruck from '$lib/components/Firetruck.svelte';
	import Road from '$lib/components/Road.svelte';
	import * as SC from 'svelte-cubed';
	import { createVehicleState } from '$lib/helpers/createVehicleState';
	import VehiclePhysics from '$lib/components/VehiclePhysics.svelte';
	import { pins } from '$lib/stores/pins';
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
	import FixCanvas from '$lib/components/FixCanvas.svelte';
	import { Label } from 'flowbite-svelte';

	let truckStates = [createVehicleState(), createVehicleState(), createVehicleState()];

	truckStates.forEach((state, i) => {
		state.state.transform.position.x = i * 5 - 5;
		state.state.transform.position.z = i * 7 - 5;
	});

	truckStates[0].state.transform.rotation.y = Math.PI;

	$: if ($serialPort.isOpen) {
		truckStates[0].state.speed = $pins[6] === 255 ? 1 : 0;
	}
</script>

<PageLayout>
	<div slot="nav-actions" class="flex gap-2">
		<SerialConnectButton />
	</div>

	<div class="flex flex-row h-full w-full">
		<div class="w-96">
			<ControlsPanel>
				{#if $serialPort.isOpen}
				<Controls open label="Serial Monitor">
					<SerialMonitor />
				</Controls>
				<Controls open label="Pin Registry" topPadding={6}>
					<PinRegistry />
				</Controls>
				{/if}
				{#each truckStates as { state, stop }, i}
					<Controls label="Firetruck {i + 1} Controls">
						<Slider bind:value={state.speed} min={-1} max={1} label="Speed" />
						<Slider bind:value={state.turn} min={-1} max={1} label="Turn" />
						<div style="align-items: center;" class="flex justify-between">
							<Joystick bind:x={state.turn} bind:y={state.speed} />
							<StopButton on:click={stop} />
						</div>
					</Controls>
				{/each}
			</ControlsPanel>
		</div>
		<div class="w-full">
			<FixCanvas>
				<SC.Canvas>
					<Road />
					{#each truckStates as { state }}
						<VehiclePhysics profile={{ maxSpeed: 1, maxTurnAngle: 30 }} bind:state />
						<Firetruck bind:state />
					{/each}
					<SC.PerspectiveCamera zoom={0.5} position={[-10, 10, 10]} />
					<SC.OrbitControls />
				</SC.Canvas>
				<style>
					.container {
						max-width: 100%;
					}
				</style>
			</FixCanvas>
		</div>
	</div>
</PageLayout>
