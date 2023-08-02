<script lang="ts">
	import { useFrame } from '@threlte/core';
	import type { VehicleState } from '$lib/types/VehicleState';
	import type { VehicleProfile } from '$lib/types/VehicleProfile';

	export let state: VehicleState;
	export let profile: VehicleProfile;

	useFrame(() => {
		const { maxTurnAngle, maxSpeed } = profile;

		const distance = state.speed * maxSpeed * 0.1;
		const { position, rotation } = state.transform;

		state.transform.rotation.y += (distance * -state.turn * maxTurnAngle * 0.5 * Math.PI) / 180;
		state.transform.position.z += distance * Math.cos(rotation.y);
		state.transform.position.x += distance * Math.sin(rotation.y);
	});
</script>
