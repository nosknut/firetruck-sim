<script lang="ts">
	import { browser } from '$app/environment';
	import { serialPort } from '$lib/stores/serial';
	import { toasts } from '$lib/stores/toasts';
	import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';

	export let large = false;
	let connectModalOpen = false;

	let webSocketUrl = (browser && localStorage.getItem('webSocketUrl')) || 'ws://localhost:4001';
	$: browser && localStorage.setItem('webSocketUrl', webSocketUrl);

	async function open(type: 'serial' | 'websocket') {
		if (type === 'serial') {
			await serialPort.openSerialPort({ baudRate: 115200 }).catch((e) => {
				toasts.add(e.message);
				console.error(e);
			});
		} else {
			await serialPort.openWebSocket(webSocketUrl).catch((e) => {
				toasts.add('Could not connect to websocket');
				console.error(e);
			});
		}

		// Requests the controller to send its current state
		await serialPort.send({ init: true });
	}
</script>

{#if !$serialPort.isOpen}
	<Button
		size={large ? 'lg' : 'sm'}
		class={large ? 'w-full mt-2' : ''}
		color="green"
		on:click={() => (connectModalOpen = true)}>Connect</Button
	>
{:else}
	<Button
		size={large ? 'lg' : 'sm'}
		class={large ? 'w-full mt-2' : ''}
		color="red"
		on:click={serialPort.close}>Disconnect</Button
	>
{/if}

<Modal bind:open={connectModalOpen} size="xs" autoclose={false} class="w-full">
	<div class="flex flex-col space-y-6">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Connect to Controller</h3>

		Connect to a controller via serial port or WebSocket.

		<Button
			class="w-full"
			on:click={() => {
				open('serial');
				connectModalOpen = false;
			}}>Serial Port</Button
		>

		<Label class="space-y-2">
			<span>WebSocket Url</span>
			<Input placeholder="WebSocket Url" bind:value={webSocketUrl} />
		</Label>
		<Button
			class="w-full"
			on:click={() => {
				open('websocket');
				connectModalOpen = false;
			}}>WebSocket</Button
		>
	</div>
</Modal>
