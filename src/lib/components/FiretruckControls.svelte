<script lang="ts">
	import type { VehicleStateStore } from '$lib/helpers/createVehicleState';
	import Joystick from './Joystick.svelte';
	import Slider from './Slider.svelte';
	import StopButton from './StopButton.svelte';

	export let state: VehicleStateStore;
</script>

<Slider bind:value={$state.speed} min={-1} max={1} label="Speed" />
<Slider bind:value={$state.turn} min={-1} max={1} label="Turn" />
<Slider bind:value={$state.boom.elevation} min={0} max={1} step={0.01} label="Boom Elevation" />
<Slider bind:value={$state.boom.rotation} min={-1} max={1} step={0.01} label="Boom Rotation" />
<StopButton on:click={state.stop} />
<Joystick bind:x={$state.turn} bind:y={$state.speed} />
