<script lang="ts">
	import { Label, Toggle } from 'flowbite-svelte';

	export let label = '';
	export let checked = 0;

	$: checkedBool = !!checked;
</script>

<Label defaultClass="text-sm font-medium block flex flex-col items-center">
	{label}
	<Toggle checked={checkedBool} on:change={() => (checked = Number(!checked))} {label} />
</Label>
