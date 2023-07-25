<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import Tire from './Tire.svelte';
	import Road from './Road.svelte';

	export let position = {
		x: 0,
		y: 0,
		z: 0
	};

	export let rotation = {
		x: 0,
		y: 0,
		z: 0
	};

	export let turn = 0;

	let width = 2.5;
	let height = 3.8;
	let length = 10;

	$: frontTireRotation = {
		x: 0,
		y: (-turn * Math.PI) / 180,
		z: 0
	};

	let tireX = width / 2;
	let tireY = 0.5;
	let tireZ = length / 2 - 1.5;
</script>

<SC.Group
	position={[position.x + 2.5, position.y + 0, position.z + 1]}
	rotation={[rotation.x, rotation.y, rotation.z]}
>
	<SC.Mesh
		material={new THREE.MeshBasicMaterial({ color: 'red' })}
		position={[0, height / 2 + 0.5, 0]}
		geometry={new THREE.BoxGeometry(width, height, length)}
	/>

	<SC.Mesh
		material={new THREE.MeshBasicMaterial({ color: 'rgb(150, 150, 150)' })}
		position={[0, height + 1, 1]}
		geometry={new THREE.BoxGeometry(1, 1, 12)}
	/>
	<SC.Mesh
		material={new THREE.MeshBasicMaterial({ color: 'rgb(70, 70, 70)' })}
		position={[0, height + 1, length / 2 + 3]}
		geometry={new THREE.BoxGeometry(2, 2, 2)}
	/>

	<SC.Mesh
		material={new THREE.MeshBasicMaterial({ color: 'rgb(30, 30, 30)' })}
		position={[0, height / 2 + 1, length / 2 - 0.75]}
		geometry={new THREE.BoxGeometry(3, height - 2, 2)}
	/>

	<Tire position={{ x: tireX, y: tireY, z: tireZ }} rotation={frontTireRotation} />
	<Tire position={{ x: -tireX, y: tireY, z: tireZ }} rotation={frontTireRotation} />
	<Tire position={{ x: tireX, y: tireY, z: -tireZ }} rotation={{ x: 0, y: 0, z: 0 }} />
	<Tire position={{ x: -tireX, y: tireY, z: -tireZ }} rotation={{ x: 0, y: 0, z: 0 }} />
</SC.Group>
