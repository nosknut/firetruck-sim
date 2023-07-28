<script lang="ts">
	import { serialPort } from '$lib/stores/serial';
	import { serialMonitor } from '$lib/stores/serialMonitor';
	import { Button, Checkbox, Label, Textarea } from 'flowbite-svelte';

	let autoScroll = true;

	$: if (autoScroll && $serialMonitor) {
		const element = document.getElementById('serial-monitor');
		if (element) {
			element.scrollTop = element.scrollHeight;
		}
	}

	function clearMonitor() {
		$serialMonitor = '';
	}
</script>

{#if $serialPort.isOpen}
	<div class="flex justify-between mb-2">
		<Checkbox bind:checked={autoScroll}>Auto Scroll</Checkbox>
		<Button size="xs" on:click={clearMonitor}>Clear</Button>
	</div>
	<Textarea
		rows="5"
		id="serial-monitor"
		placeholder="No messages"
		bind:value={$serialMonitor}
		readOnly
	/>
{/if}
