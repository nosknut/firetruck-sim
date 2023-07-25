<script lang="ts">
	export let value = 0;
	export let min = 0;
	export let max = 1;
	export let step = 0.1;
	export let label = 'Value';
	export let numDigits = 2;
	export let unit = '';
</script>

<label class="slider">
	{label}:
	<input type="range" bind:value {min} {max} {step} />
	{value.toFixed(numDigits)}{unit}
</label>

<style>
	.slider {
		display: flex;
		align-items: center;
	}
</style>
