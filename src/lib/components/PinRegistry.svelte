<script lang="ts">
	import { serialPort } from '$lib/stores/serial';
	import { modes, pins, simPins } from '$lib/stores/pins';
	import { Input, Toggle } from 'flowbite-svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onEnter } from '$lib/helpers/onEnter';

	let valueInputs: { [pin: string]: number } = {};

	function setPin(pin: string) {
		const value = Number(valueInputs[pin]);
		if (!isNaN(value)) {
			pins.setPin(pin, value);
		}
		delete valueInputs[pin];
		valueInputs = valueInputs;
	}
</script>

{#if $serialPort.isOpen}
	{#if Object.keys($modes).length}
		<Table shadow color="blue">
			<TableHead theadClass="text-xs uppercase text-center">
				<TableHeadCell>Pin</TableHeadCell>
				<TableHeadCell>Value</TableHeadCell>
				<TableHeadCell>Toggle</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each Object.keys($modes) as pin (pin)}
					<TableBodyRow color={$pins[pin] ? 'green' : 'blue'}>
						<TableBodyCell tdClass="px-6 py-1 whitespace-nowrap font-medium">{pin}</TableBodyCell>
						<TableBodyCell tdClass="px-6 py-1 whitespace-nowrap font-medium">
							<div class="flex justify-center">
								{#if $modes[pin] === 'input'}
									<Input
										size="sm"
										placeholder={$pins[pin]}
										bind:value={valueInputs[pin]}
										defaultClass="w-10 h-5 text-center"
										on:keydown={onEnter(() => setPin(pin))}
									/>
								{:else}
									{$pins[pin]}
								{/if}
							</div>
						</TableBodyCell>
						<TableBodyCell tdClass="px-6 py-1 whitespace-nowrap font-medium">
							<div class="flex justify-center">
								{#if $simPins.has(pin)}
									Sim
								{:else if $modes[pin] === 'input'}
									<Toggle
										size="small"
										checked={!!$pins[pin]}
										on:change={() => pins.setPin(pin, !$pins[pin])}
									/>
								{:else}
									Output
								{/if}
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{:else}
		No pins detected. The controller might not be running or you may have forgotten to run
		pinMode().
	{/if}
{/if}
