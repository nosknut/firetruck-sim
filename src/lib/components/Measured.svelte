<script lang="ts">
	let height = 0;
	let width = 0;
</script>

<div class="w-full h-full" bind:clientHeight={height} bind:clientWidth={width}>
	<slot {height} {width} />
</div>
