<script>
	export let label = 'Controls';
</script>

<div class="controls">
	{label}
	<br />
	<br />

	<slot>No controls provided</slot>
</div>

<style>
	.controls {
		color: white;
		background-color: rgb(39, 39, 39);
		padding: 10px;
		box-shadow: 2px 2px 10px black;
	}
</style>
