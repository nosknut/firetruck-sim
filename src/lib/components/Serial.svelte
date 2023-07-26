<script lang="ts">
	import { serialPort } from '$lib/stores/serial';
	import { onDestroy } from 'svelte';

	async function open() {
		await serialPort.open({ baudRate: 115200 });

		await serialPort.onReceive((data: {topic: string}) => {
			console.log(`Received:`, data.topic);
		});
	}

	onDestroy(() => {
		serialPort.close();
	});
</script>

<button id="connect" on:click={open}>Connect</button>
<button id="disconnect" on:click={serialPort.close}>Disconnect</button>
