<script lang="ts">
	import { Toggle } from 'flowbite-svelte';

	export let label = '';
	export let checked = 0;

	$: checkedBool = !!checked;
</script>

<Toggle checked={checkedBool} on:change={() => (checked = Number(!checked))} {label} />
