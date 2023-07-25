<script lang="ts">
	import * as THREE from 'three';
	import * as SC from 'svelte-cubed';

	let drive = 0;

	let width = 2.5;
	let height = 3.8;
	let length = 10;

	let roadTexture = new THREE.TextureLoader().load('src/lib/images/street.jpg');
	roadTexture.wrapS = THREE.RepeatWrapping;
	roadTexture.wrapT = THREE.RepeatWrapping;
	roadTexture.repeat.set(1, 1);
	roadTexture.rotation = Math.PI / 2;

	let roadMaterial = new THREE.MeshBasicMaterial({
		map: roadTexture
	});
</script>

<SC.Canvas>
	<SC.Group position={[2.5, 0, 1 + drive]}>
		<SC.Mesh
			material={new THREE.MeshBasicMaterial({ color: 'red' })}
			position={[0, height / 2 + 0.5, 0]}
			geometry={new THREE.BoxGeometry(width, height, length)}
		/>
		<SC.Mesh
			material={new THREE.MeshBasicMaterial({ color: 'black' })}
			position={[width / 2, 0.5, length / 2 - 1.5]}
			geometry={new THREE.BoxGeometry(0.5, 1, 1)}
		/>
		<SC.Mesh
			material={new THREE.MeshBasicMaterial({ color: 'black' })}
			position={[-width / 2, 0.5, length / 2 - 1.5]}
			geometry={new THREE.BoxGeometry(0.5, 1, 1)}
		/>
		<SC.Mesh
			material={new THREE.MeshBasicMaterial({ color: 'black' })}
			position={[-width / 2, 0.5, -length / 2 + 1.5]}
			geometry={new THREE.BoxGeometry(0.5, 1, 1)}
		/>
		<SC.Mesh
			material={new THREE.MeshBasicMaterial({ color: 'black' })}
			position={[width / 2, 0.5, -length / 2 + 1.5]}
			geometry={new THREE.BoxGeometry(0.5, 1, 1)}
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
	</SC.Group>
	<SC.Mesh
		material={roadMaterial}
		position={[0, 0, 0]}
		geometry={new THREE.PlaneGeometry(10, 20)}
		rotation={[-Math.PI / 2, 0, 0]}
	/>
	<SC.PerspectiveCamera zoom={0.5} position={[-10, 10, 10]} />
	<SC.OrbitControls />
</SC.Canvas>

<div class="controls">
	Controls
	<br />
	<br />
	<label>
		Drive:
		<input type="range" bind:value={drive} min="-3" max="3" step="0.1" />
		{drive}
	</label>
</div>

<style>
	.controls {
		position: absolute;
		color: white;
		background-color: rgb(39, 39, 39);
		padding: 10px;
	}
	.controls label {
		display: flex;
		align-items: center;
	}
</style>
