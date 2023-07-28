<script lang="ts">
	let height = 0;
	let width = 0;
</script>

<div bind:clientHeight={height} bind:clientWidth={width} class="h-full w-full">
	<slot />
</div>
