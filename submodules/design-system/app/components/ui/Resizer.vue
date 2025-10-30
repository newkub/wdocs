<script setup lang="ts">
interface Props {
	direction: "horizontal" | "vertical";
}

const props = defineProps<Props>();

const emit = defineEmits(["resize:start", "resize:move", "resize:end"]);

const handleMouseDown = (startEvent: MouseEvent) => {
	emit("resize:start");

	const onMouseMove = (moveEvent: MouseEvent) => {
		const deltaX = moveEvent.clientX - startEvent.clientX;
		const deltaY = moveEvent.clientY - startEvent.clientY;
		emit("resize:move", { deltaX, deltaY });
	};

	const onMouseUp = () => {
		window.removeEventListener("mousemove", onMouseMove);
		window.removeEventListener("mouseup", onMouseUp);
		emit("resize:end");
	};

	window.addEventListener("mousemove", onMouseMove);
	window.addEventListener("mouseup", onMouseUp);
};

const classes = {
	horizontal:
		"w-1 bg-gray-200 hover:bg-primary-500 cursor-col-resize flex-shrink-0",
	vertical:
		"h-1 bg-gray-200 hover:bg-primary-500 cursor-row-resize flex-shrink-0 w-full",
};
</script>

<template>
  <div
    :class="classes[direction]"
    @mousedown="handleMouseDown"
  />
</template>
