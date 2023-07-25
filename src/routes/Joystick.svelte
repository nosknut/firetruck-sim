<script lang="ts">
	export let size = 100;
	export let round = false;

	export let x = 0;
	export let y = 0;

	let joystickPosition = {
		x: 0,
		y: 0
	};

	let handlePosition = {
		x: 0,
		y: 0
	};

	let joystickSize = {
		width: 0,
		height: 0
	};

	let clicked = false;

	$: if (!clicked) {
		x = 0;
		y = 0;
	}

	$: xPos = x * (size / 2);
	$: yPos = -y * (size / 2);

	function onDrag(event: MouseEvent) {
		if (!clicked) return;
		let xPos = -(joystickPosition.x - event.clientX) + joystickSize.width * 0.25;
		let yPos = -(joystickPosition.y - event.clientY) + joystickSize.height * 0.25;

		let distance = Math.sqrt(xPos * xPos + yPos * yPos);
		let angle = Math.atan2(yPos, xPos);
		if (distance > size / 2) {
			xPos = (Math.cos(angle) * size) / 2;
			yPos = (Math.sin(angle) * size) / 2;
		}

		x = xPos / (size / 2);
		y = -yPos / (size / 2);
	}
</script>

<div class="joystick" class:round on:mousemove={onDrag} role="button" tabindex="0">
	<div
		class="joystick-area"
		style="width: {size}px; height: {size}px;"
		bind:clientWidth={joystickSize.width}
		bind:clientHeight={joystickSize.height}
		bind:offsetHeight={joystickPosition.y}
		bind:offsetWidth={joystickPosition.x}
	>
		<button
			class="joystick-handle"
			on:mousedown={() => (clicked = true)}
			on:mouseup={() => (clicked = false)}
			style="width: {size / 2}px; height: {size / 2}px; top: {yPos}px; left: {xPos}px;"
			bind:offsetHeight={handlePosition.y}
			bind:offsetWidth={handlePosition.x}
		/>
	</div>
</div>

<style>
	.joystick {
		padding: 10px;
		width: min-content;
		position: relative;
	}
	.joystick-area {
		background-color: blue;
		display: grid;
		place-content: center;
	}

	.joystick.round .joystick-area {
		border-radius: 50%;
	}

	.joystick-handle {
		background-color: darkblue;
		border-radius: 50%;
	}
</style>
