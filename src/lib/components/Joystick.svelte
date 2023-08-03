<script lang="ts">
	import { Label } from "flowbite-svelte";

	export let label = "Joystick";

	export let snapDown = false;

	export let size = 100;
	export let round = false;

	export let x = 0;
	export let y = 0;

	export let angle = 0;
	export let distance = 0;

	export let xPos = 0;
	export let yPos = 0;

	export let colors = {
		background: 'transparent',
		area: 'grey',
		handle: 'darkgrey'
	};

	let areaHandle: HTMLDivElement;

	let joystickSize = {
		width: 0,
		height: 0
	};

	$: joystickHalfSize = {
		width: joystickSize.width / 2,
		height: joystickSize.height / 2
	};

	$: yOffset = snapDown ? joystickSize.height : joystickHalfSize.height;

	let clicked = false;

	$: if (!clicked) {
		x = 0;
		y = 0;
		xPos = 0;
		yPos = 0;
	}

	function onDrag(event: MouseEvent) {
		if (!clicked) return;
		let joystickPosition = areaHandle.getBoundingClientRect();

		xPos = -(joystickPosition.x - event.clientX) - joystickHalfSize.width;
		yPos = joystickPosition.y - event.clientY + yOffset;
		distance = Math.sqrt(xPos * xPos + yPos * yPos);
		angle = Math.atan2(yPos, xPos);

		if (round) {
			if (distance > size / 2) {
				xPos = Math.cos(angle) * joystickHalfSize.width;
				yPos = Math.sin(angle) * yOffset;
			}
		} else {
			if (xPos > joystickHalfSize.width) xPos = joystickHalfSize.width;
			if (xPos < -joystickHalfSize.width) xPos = -joystickHalfSize.width;
			if (yPos > yOffset) yPos = yOffset;
			if (yPos < -yOffset) yPos = -yOffset;
		}

		x = xPos / joystickHalfSize.width;
		y = yPos / yOffset;
	}
</script>

<svelte:body on:mouseup={() => (clicked = false)} on:mousemove={onDrag} />

<div class="joystick" class:round style="background-color: {colors.background};">
	<Label class="text-center">
		{label}
		<div
			class="joystick-area"
			style="width: {size}px; height: {size}px; background-color: {colors.area};"
			bind:clientWidth={joystickSize.width}
			bind:clientHeight={joystickSize.height}
			bind:this={areaHandle}
		>
			<button
				class="joystick-handle"
				on:mousedown={() => (clicked = true)}
				style="width: {size / 2}px; height: {size / 2}px; top: {-yPos +
					yOffset}px; left: {xPos +
					joystickHalfSize.width}px; transform: translate(-50%, -50%); background-color: {colors.handle};"
			/>
		</div>
	</Label>
</div>

<style>
	.joystick {
		width: min-content;
		margin: 0 auto;
	}
	.joystick-area {
		position: relative;
		border-radius: 5px;
	}

	.joystick.round .joystick-area {
		border-radius: 50%;
	}

	.joystick-handle {
		border-radius: 50%;
		position: absolute;
		border: none;
	}

	.joystick-handle:active {
		box-shadow: inset 0 0 10px black;
	}
</style>
