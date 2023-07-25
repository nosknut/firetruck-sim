<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import Firetruck from './Firetruck.svelte';

	export let speed = 0;
	export let turn = 0;

	let truck = {
		turn,
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	};

	$: truck.turn = turn;

	SC.onFrame(() => {
		let distance = speed * 0.1;
		truck.rotation.y += (distance * -truck.turn * 0.5 * Math.PI) / 180;
		truck.position.z += distance * Math.cos(truck.rotation.y);
		truck.position.x += distance * Math.sin(truck.rotation.y);
	});
</script>

<Firetruck {...truck} />
