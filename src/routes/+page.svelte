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

	let truckState = createVehicleState();

	function stop() {
		truckState.turn = 0;
		truckState.speed = 0;
	}
</script>

<SC.Canvas>
	<Road />
	<VehiclePhysics profile={{ maxSpeed: 1, maxTurnAngle: 30 }} bind:state={truckState} />
	<Firetruck bind:state={truckState} />
	<SC.PerspectiveCamera zoom={0.5} position={[-10, 10, 10]} />
	<SC.OrbitControls />
</SC.Canvas>

<ControlsPanel>
	<Controls label="Firetruck Controls">
		<Slider bind:value={truckState.speed} min={-1} max={1} label="Speed" />
		<Slider bind:value={truckState.turn} min={-1} max={1} label="Turn" />
		<StopButton on:click={stop} />
		<Joystick bind:x={truckState.turn} bind:y={truckState.speed} />
	</Controls>
</ControlsPanel>
