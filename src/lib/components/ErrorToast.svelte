<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import { fly } from 'svelte/transition';
	import ErrorIcon from './ErrorIcon.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let open = false;
	export let message: string;
	export let offset = 0;

	$: open = !!message;

	$: if (!open) {
		setTimeout(() => dispatch('close'), 1000);
	}
</script>

<Toast
	class="fixed z-10 bottom-10 right-10 bg-red-950 dark:bg-red-950 text-white dark:text-white"
	bind:open
	transition={fly}
	params={{ x: 200 }}
	style="margin-bottom: {offset}px;"
	defaultIconClass="w-8 h-8 bg-red-800 text-red-200 dark:bg-red-800 dark:text-red-200"
>
	<svelte:fragment slot="icon">
		<ErrorIcon />
	</svelte:fragment>
	{message}
</Toast>
