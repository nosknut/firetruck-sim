<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import Road from './Road.svelte';
	import Firetruck from './Firetruck.svelte';
	import DrivableFireTruck from './DrivableFiretruck.svelte';
	import Joystick from './Joystick.svelte';
	let speed = 0;
	let turn = 0;
	/*
	function stop() {
		speed = 0;
		turn = 0;
	}
	*/
</script>

<SC.Canvas>
	<Road />
	<DrivableFireTruck {speed} turn={turn * 30} />
	<SC.PerspectiveCamera zoom={0.5} position={[-10, 10, 10]} />
	<SC.OrbitControls />
</SC.Canvas>

<div class="controls">
	<!--
	Controls
	<br />
	<br />
	<label>
		Speed:
		<input type="range" bind:value={speed} min="-0.5" max="0.5" step="0.01" />
		{speed}
	</label>
	
	<label>
		Turn:
		<input type="range" bind:value={turn} min="-30" max="30" step="0.1" />
		{turn}
	</label>
	
	<button class="stop-button" on:click={stop}> Stop </button>
-->

	<Joystick bind:x={turn} bind:y={speed} />
</div>

<style>
	.controls {
		position: absolute;
		color: white;
		background-color: rgb(39, 39, 39);
		padding: 10px;
	}
	/*
	.controls label {
		display: flex;
		align-items: center;
	}
	.controls button {
		margin-top: 10px;
	}
	.stop-button {
		border-radius: 50%;
		background-color: red;
		height: 50px;
		width: 50px;
		color: white;
	}
	*/
</style>
