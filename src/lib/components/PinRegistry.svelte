<script lang="ts">
	import { serialPort } from '$lib/stores/serial';
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
	import { pins, type Pin, type PinStore } from '$lib/stores/pins';
	import { simPins } from '$lib/stores/simPins';

	let valueInputs: { [pin: string]: number } = {};

	function setPin(pin: Pin, store: PinStore) {
		const value = Number(valueInputs[pin.pin]);
		if (!isNaN(value)) {
			store.set({ ...pin, numberValue: value });
		}
		delete valueInputs[pin.pin];
		valueInputs = valueInputs;
	}
</script>

{#if $serialPort.isOpen}
	{#if Object.values($pins).filter(({ pin: { mode } }) => mode !== undefined).length}
		<Table shadow color="blue">
			<TableHead theadClass="text-xs uppercase text-center">
				<TableHeadCell>Pin</TableHeadCell>
				<TableHeadCell>Value</TableHeadCell>
				<TableHeadCell>Toggle</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each Object.values($pins) as { store, pin } (pin.pin)}
					<TableBodyRow color={pin.boolValue ? 'green' : 'blue'}>
						<TableBodyCell tdClass="px-6 py-1 whitespace-nowrap font-medium"
							>{pin.pin}</TableBodyCell
						>
						<TableBodyCell tdClass="px-6 py-1 whitespace-nowrap font-medium">
							<div class="flex justify-center">
								{#if pin.mode === 'input'}
									<Input
										size="sm"
										placeholder={pin.numberValue}
										bind:value={valueInputs[pin.pin]}
										defaultClass="w-10 h-5 text-center"
										on:keydown={onEnter(() => setPin(pin, store))}
									/>
								{:else}
									{pin.numberValue}
								{/if}
							</div>
						</TableBodyCell>
						<TableBodyCell tdClass="px-6 py-1 whitespace-nowrap font-medium">
							<div class="flex justify-center">
								{#if $simPins.has(pin.pin)}
									Sim
								{:else if pin.mode === 'input'}
									<Toggle
										size="small"
										checked={pin.boolValue}
										on:change={() => store.set({ ...pin, boolValue: !pin.boolValue })}
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
