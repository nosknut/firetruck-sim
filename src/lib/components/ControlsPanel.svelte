<div class="controls-panel">
	<slot>No controls provided</slot>
</div>

<style>
	.controls-panel {
		position: absolute;
        background-color: rgb(31, 31, 31);
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        color: white;
        max-height: 90vh;
        overflow-y: auto;
	}
</style>
