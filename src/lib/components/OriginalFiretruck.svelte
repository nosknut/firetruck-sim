<script lang="ts">
	import { T } from '@threlte/core';
	import Tire from './Tire.svelte';
	import type { VehicleState } from '$lib/types/VehicleState';
	import { createVehicleState } from '$lib/helpers/createVehicleState';

	export let state: VehicleState = createVehicleState().state;

	$: position = state.transform.position;
	$: rotation = state.transform.rotation;

	let width = 2.5;
	let height = 3.8;
	let length = 10;

	$: frontTireRotation = {
		x: 0,
		y: (-state.turn * Math.PI) / 180,
		z: 0
	};

	let tireX = width / 2;
	let tireY = 0.5;
	let tireZ = length / 2 - 1.5;

	const maxColor = 500;
</script>

<T.Group
	position={[position.x + 2.5, position.y + 0, position.z + 1]}
	rotation={[rotation.x, rotation.y, rotation.z]}
>
	<T.Mesh position={[0, height / 2 + 0.5, 0]}>
		<T.MeshBasicMaterial color={[255 / maxColor, 0, 0]} />
		<T.BoxGeometry args={[width, height, length]} />
	</T.Mesh>

	<T.Mesh position={[0, height + 1, 1]}>
		<T.MeshBasicMaterial color={[150 / maxColor, 150 / maxColor, 150 / maxColor]} />
		<T.BoxGeometry args={[1, 1, 12]} />
	</T.Mesh>
	<T.Mesh position={[0, height + 1, length / 2 + 3]}>
		<T.MeshBasicMaterial color={[70 / maxColor, 70 / maxColor, 70 / maxColor]} />
		<T.BoxGeometry args={[2, 2, 2]} />
	</T.Mesh>

	<T.Mesh position={[0, height / 2 + 1, length / 2 - 0.75]}>
		<T.MeshBasicMaterial color={[30 / maxColor, 30 / maxColor, 30 / maxColor]} />
		<T.BoxGeometry args={[3, height - 2, 2]} />
	</T.Mesh>

	<Tire position={{ x: tireX, y: tireY, z: tireZ }} rotation={frontTireRotation} />
	<Tire position={{ x: -tireX, y: tireY, z: tireZ }} rotation={frontTireRotation} />
	<Tire position={{ x: tireX, y: tireY, z: -tireZ }} rotation={{ x: 0, y: 0, z: 0 }} />
	<Tire position={{ x: -tireX, y: tireY, z: -tireZ }} rotation={{ x: 0, y: 0, z: 0 }} />
</T.Group>
