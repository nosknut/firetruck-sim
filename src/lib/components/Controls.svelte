<script lang="ts">
	import { Card } from 'flowbite-svelte';

	export let label = 'Controls';
	export let open = false;
	export let topPadding = 2;

	// scroll to card when expading

	let anchor: HTMLDivElement;

	$: if (open) {
		anchor?.scrollIntoView({
			behavior: 'smooth'
		});
	}
</script>

<div bind:this={anchor}>
	<Card class="font-normal text-gray-700 dark:text-gray-400 leading-tight shadow-lg gap-1">
		<details bind:open>
			<summary>
				<h5 class="inline mb-2 font-bold tracking-tight text-gray-900 dark:text-white">{label}</h5>
			</summary>
			<div class="w-full h-{topPadding}" />
			<slot>No controls provided</slot>
		</details>
	</Card>
</div>
