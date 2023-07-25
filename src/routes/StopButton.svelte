<script lang="ts">

</script>

<button class="stop-button" on:click>Stop</button>

<style>
	.stop-button {
		border-radius: 50%;
		background-color: red;
		height: 50px;
		width: 50px;
		color: white;
        border: none;
		margin: 10px;
		box-shadow: inset 0 0 10px black;
	}

    .stop-button:hover {
		box-shadow: inset 0 0 15px black;
    }

    .stop-button:active {
		box-shadow: inset 0 0 20px black;
    }
</style>
