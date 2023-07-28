<script>
	import ErrorToast from '$lib/components/ErrorToast.svelte';
	import { toasts } from '$lib/stores/toasts';
	import '../app.css';
</script>

{#each $toasts as toast, i (toast.id)}
	<ErrorToast offset={i * 80} message={toast.message} on:close={() => {
		toasts.remove(toast.id)
	}} />
{/each}

<slot />
