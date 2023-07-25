<script lang="ts">
	import * as SC from 'svelte-cubed';
	import Road from './Road.svelte';
	import DrivableFireTruck from './DrivableFiretruck.svelte';
	import Joystick from './Joystick.svelte';
	import Slider from './Slider.svelte';
	import Controls from './Controls.svelte';
	import StopButton from './StopButton.svelte';
	import ControlsPanel from './ControlsPanel.svelte';

	let speed = 0;
	let turn = 0;

	function stop() {
		speed = 0;
		turn = 0;
	}
</script>

<SC.Canvas>
	<Road />
	<DrivableFireTruck {speed} turn={turn * 30} />
	<SC.PerspectiveCamera zoom={0.5} position={[-10, 10, 10]} />
	<SC.OrbitControls />
</SC.Canvas>

<ControlsPanel>
	<Controls label="Firetruck Controls">
		<Slider bind:value={speed} min={-1} max={1} label="Speed" />
		<Slider bind:value={turn} min={-1} max={1} label="Turn" />
		<StopButton on:click={stop} />
		<Joystick bind:x={turn} bind:y={speed} />
	</Controls>
</ControlsPanel>
