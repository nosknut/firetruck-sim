<script lang="ts">
	import { T } from '@threlte/core';

	export let position: {
		x: number;
		y: number;
		z: number;
	};

	export let rotation: {
		x: number;
		y: number;
		z: number;
	};
</script>

<T.Mesh
	position={[position.x, position.y, position.z]}
	rotation={[rotation.x, rotation.y, rotation.z + Math.PI / 2]}
>
	<T.MeshBasicMaterial color={[0, 0, 0]} />
	<T.CylinderGeometry args={[0.75, 0.75, 0.5]} />
</T.Mesh>
