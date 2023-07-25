<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';
	import { CylinderGeometry } from 'three';

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

<SC.Mesh
	material={new THREE.MeshBasicMaterial({ color: 'black' })}
	position={[position.x, position.y, position.z]}
	rotation={[rotation.x, rotation.y, rotation.z + Math.PI/2]}
	geometry={new THREE.CylinderGeometry(0.75, 0.75, 0.5)}
/>
