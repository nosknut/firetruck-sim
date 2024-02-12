<script lang="ts">
	import { browser } from '$app/environment';
	import { parseIntOrDefault } from '$lib/helpers/parseIntOrDefault';
	import { serialPort } from '$lib/stores/serial';
	import { toasts } from '$lib/stores/toasts';
	import { Button, Modal, Label, Input, Checkbox, Spinner, A } from 'flowbite-svelte';

	export let large = false;

	let connectingSerial = false;
	let connectingWebSocket = false;

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
		connectingSerial = true;
		await serialPort
			.openSerialPort({ baudRate })
			.then(onConnect)
			.catch(() => {})
			.finally(() => {
				connectModalOpen = false;
				connectingSerial = false;
			});
	}

	async function openWebsocket() {
		connectingWebSocket = true;
		await serialPort
			.openWebSocket(webSocketUrl)
			.then(onConnect)
			.catch(() => {})
			.finally(() => {
				connectModalOpen = false;
				connectingWebSocket = false;
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

		<p>Connect to a controller via serial port or WebSocket.</p>
		<p>
			NB! Remember to import <A href="/FiretruckSim.h" target="_blank" download="FiretruckSim.h">this</A> file into
			your .ino file and install
			<A href="https://www.arduino.cc/reference/en/libraries/arduinojson/" target="_blank">ArduinoJson</A>.
		</p>

		<Label class="space-y-2">
			<span>Baud Rate</span>
			<Input placeholder="Baud Rate" type="number" bind:value={baudRate} />
		</Label>
		<Button class="w-full" disabled={isNaN(baudRate) || connectingSerial} on:click={openSerial}>
			{#if connectingSerial}
				<Spinner class="mr-3" size="4" color="white" />
			{/if}
			Serial Port
		</Button>

		<Label class="space-y-2">
			<span>WebSocket Url</span>
			<Input placeholder="WebSocket Url" bind:value={webSocketUrl} />
		</Label>
		<Button class="w-full" on:click={openWebsocket} disabled={connectingWebSocket}>
			{#if connectingWebSocket}
				<Spinner class="mr-3" size="4" color="white" />
			{/if}
			WebSocket
		</Button>
	</div>
</Modal>
