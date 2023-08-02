<script lang="ts">
	import { T, watch } from '@threlte/core';
	import image from '$lib/images/street.jpg';
	import { useTexture } from '@threlte/extras';
	import { RepeatWrapping } from 'three/src/constants';

	const roadTexture = useTexture(image);

	watch(roadTexture, (texture) => {
		if (texture) {
			texture.wrapS = RepeatWrapping;
			texture.wrapT = RepeatWrapping;
			texture.repeat.set(1, 2);
			texture.rotation = Math.PI / 2;
		}
	});
</script>

{#if $roadTexture}
	<T.Mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
		<T.PlaneGeometry args={[20, 40]} />
		<T.MeshStandardMaterial map={$roadTexture} />
	</T.Mesh>
{/if}
