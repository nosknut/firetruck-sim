<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';

	let roadTexture = new THREE.TextureLoader().load('src/lib/images/street.jpg');
	roadTexture.wrapS = THREE.RepeatWrapping;
	roadTexture.wrapT = THREE.RepeatWrapping;
	roadTexture.repeat.set(1, 1);
	roadTexture.rotation = Math.PI / 2;

	let roadMaterial = new THREE.MeshBasicMaterial({
		map: roadTexture
	});
</script>

<SC.Mesh
	material={roadMaterial}
	position={[0, 0, 0]}
	geometry={new THREE.PlaneGeometry(10, 20)}
	rotation={[-Math.PI / 2, 0, 0]}
/>
