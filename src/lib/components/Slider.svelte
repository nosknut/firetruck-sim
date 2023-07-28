<script lang="ts">
	import { Label } from "flowbite-svelte";

	export let value = 0;
	export let min = 0;
	export let max = 1;
	export let step = 0.1;
	export let label = 'Value';
	export let numDigits = 2;
	export let unit = '';
</script>

<Label>
	{label}: {value.toFixed(numDigits)}{unit}
	<input class="w-full" type="range" bind:value {min} {max} {step} />
</Label>
