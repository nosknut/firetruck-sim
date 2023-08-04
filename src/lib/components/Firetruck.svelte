<script lang="ts">
	import type { VehicleStateStore } from '$lib/helpers/createVehicleState';
	import { Suspense } from '@threlte/extras';
	import Firetruck from './models/Firetruck.svelte';
	import { setAnimation } from '$lib/helpers/setAnimation';
	import { reversible } from '$lib/helpers/reversible';

	export let state: VehicleStateStore;

	$: position = $state.transform.position;
	$: rotation = $state.transform.rotation;

	let actions: Firetruck['$$prop_def']['actions'];

	$: setAnimation($actions?.Wiper, $state.wiper);
	$: setAnimation($actions?.BoomElbow, $state.boom.elbow);
	$: setAnimation($actions?.BoomWrist, $state.boom.wrist);
	$: setAnimation($actions?.HeadlightsOn, Number($state.lights.headlights));
	$: setAnimation($actions?.RFlashOn, Number($state.lights.flash.right));
	$: setAnimation($actions?.LFlashOn, Number($state.lights.flash.left));

	$: setAnimation($actions?.BoomLift, $state.boom.elevation);
	$: setAnimation($actions?.BoomRotate, reversible($state.boom.rotation, 1));

	$: {
		setAnimation($actions?.TurnLeft, $state.turn < 0 ? -$state.turn : 0);
		setAnimation($actions?.TurnRight, $state.turn > 0 ? $state.turn : 0);
	}
</script>

<Suspense>
	<Firetruck bind:actions position={position.toArray()} rotation={rotation.toArray()} />
</Suspense>
