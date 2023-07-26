<script lang="ts">
	import Firetruck from '$lib/components/Firetruck.svelte';
	import Joystick from '$lib/components/Joystick.svelte';
	import Road from '$lib/components/Road.svelte';
	import * as SC from 'svelte-cubed';
	import Controls from '$lib/components/Controls.svelte';
	import ControlsPanel from '$lib/components/ControlsPanel.svelte';
	import Slider from '$lib/components/Slider.svelte';
	import StopButton from '$lib/components/StopButton.svelte';
	import { createVehicleState } from '$lib/helpers/createVehicleState';
	import VehiclePhysics from '$lib/components/VehiclePhysics.svelte';
	import Serial from '$lib/components/Serial.svelte';

	let truckStates = [createVehicleState(), createVehicleState(), createVehicleState()];

	truckStates.forEach((state, i) => {
		state.state.transform.position.x = i * 5 - 5;
		state.state.transform.position.z = i * 7 - 5;
	});

	truckStates[0].state.transform.rotation.y = Math.PI;

</script>

<SC.Canvas>
	<Road />
	{#each truckStates as { state }}
		<VehiclePhysics profile={{ maxSpeed: 1, maxTurnAngle: 30 }} bind:state />
		<Firetruck bind:state />
	{/each}
	<SC.PerspectiveCamera zoom={0.5} position={[-10, 10, 10]} />
	<SC.OrbitControls />
</SC.Canvas>

<ControlsPanel>
	<Controls label="Serial Port">
		<Serial />
	</Controls>
	{#each truckStates as { state, stop }, i}
		<Controls label="Firetruck {i + 1} Controls">
			<Slider bind:value={state.speed} min={-1} max={1} label="Speed" />
			<Slider bind:value={state.turn} min={-1} max={1} label="Turn" />
			<StopButton on:click={stop} />
			<Joystick bind:x={state.turn} bind:y={state.speed} />
		</Controls>
	{/each}
</ControlsPanel>
