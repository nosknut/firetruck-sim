<script lang="ts">
	import { pins } from '$lib/stores/pins';
	import { serialPort } from '$lib/stores/serial';
	import { onDestroy } from 'svelte';

	let monitorBox: HTMLTextAreaElement;
	let autoscroll = true;
	let monitor = '';

	$: if (autoscroll && monitor && monitorBox) {
		monitorBox.scrollTop = monitorBox.scrollHeight;
	}

	function toggleAutoscroll() {
		autoscroll = !autoscroll;
	}

	function clearMonitor() {
		monitor = '';
	}

	async function open() {
		await serialPort.open({ baudRate: 115200 });

		await serialPort.onReceive((data: { pin: number; value: number } | { print: string }) => {
			if ('pin' in data) {
				pins.syncPin(data.pin, data.value);
			}

			if ('print' in data) {
				monitor += data.print;
				console.log('Serial: ', data.print);
			}
		});
	}

	onDestroy(() => {
		serialPort.close();
	});
</script>

{#if !$serialPort.isOpen}
	<button class="connect-button connect" on:click={open}>Connect</button>
{:else}
	<button class="connect-button disconnect" on:click={serialPort.close}>Disconnect</button>

	<br />
	<br />

	<details>
		<summary>Serial Monitor</summary>
		<button on:click={toggleAutoscroll}>Auto Scroll {autoscroll ? 'off' : 'on'}</button>
		<button on:click={clearMonitor}>Clear</button>
		<br />
		<br />
		<textarea rows="5" cols="25" bind:value={monitor} bind:this={monitorBox} />
	</details>

	<br />

	<details>
		<summary>Pin Values</summary>
		{#each Object.keys($pins) as pin (pin)}
			<div class="pin">
				<div style="display: inline;">Pin {pin}: {$pins[pin]}</div>
				<div>
					{#if $pins[pin] === 0}
						<button on:click={() => pins.setPin(pin, 1)}>Toggle On</button>
					{:else}
						<button on:click={() => pins.setPin(pin, 0)}>Toggle Off</button>
					{/if}
				</div>
			</div>
		{/each}
	</details>
{/if}

<style>
	.connect-button {
		border: none;
		color: white;
		padding: 10px 32px;
		width: 100%;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
	}

	.connect {
		background-color: #4caf50;
	}

	.disconnect {
		background-color: #f44336;
	}

	.pin {
		display: flex;
		justify-content: space-between;
	}
</style>
