<script lang="ts">
	import { Label, Toggle } from 'flowbite-svelte';

	export let label = '';
	export let checked = false;
</script>

<Label defaultClass="text-sm font-medium block flex flex-col items-center">
	{label}
	<Toggle bind:checked={checked} {label} />
</Label>
