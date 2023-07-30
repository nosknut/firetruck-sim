<script lang="ts">
	import { browser } from '$app/environment';
	import { parseIntOrDefault } from '$lib/helpers/parseIntOrDefault';
	import { serialPort } from '$lib/stores/serial';
	import { toasts } from '$lib/stores/toasts';
	import { Button, Modal, Label, Input, Checkbox } from 'flowbite-svelte';

	export let large = false;

	let connectModalOpen = false;

	let baudRate = browser ? parseIntOrDefault(localStorage.getItem('baudRate'), 115200) : 115200;
	$: browser && localStorage.setItem('baudRate', String(baudRate));

	let webSocketUrl = (browser && localStorage.getItem('webSocketUrl')) || 'ws://localhost:4001';
	$: browser && localStorage.setItem('webSocketUrl', webSocketUrl);

	async function onConnect() {
		// Requests the controller to send its current state
		await serialPort.send({ init: true }).catch(() => {});
	}

	async function openSerial() {
		await serialPort
			.openSerialPort({ baudRate })
			.then(onConnect)
			.catch(() => {})
			.finally(() => {
				connectModalOpen = false;
			});
	}

	async function openWebsocket() {
		await serialPort
			.openWebSocket(webSocketUrl)
			.then(onConnect)
			.catch(() => {})
			.finally(() => {
				connectModalOpen = false;
			});
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

		<Label class="space-y-2">
			<span>Baud Rate</span>
			<Input placeholder="Baud Rate" type="number" bind:value={baudRate} />
		</Label>
		<Button class="w-full" disabled={isNaN(baudRate)} on:click={openSerial}>Serial Port</Button>

		<Label class="space-y-2">
			<span>WebSocket Url</span>
			<Input placeholder="WebSocket Url" bind:value={webSocketUrl} />
		</Label>
		<Button class="w-full" on:click={openWebsocket}>WebSocket</Button>
	</div>
</Modal>
