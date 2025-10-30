<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
	mainCanvas: HTMLCanvasElement | null;
	viewport: { x: number; y: number; width: number; height: number };
}>();

const minimapCanvas = ref<HTMLCanvasElement | null>(null);
const minimapSize = { height: 150, width: 200 };

const drawMinimap = () => {
	if (!props.mainCanvas || !minimapCanvas.value) return;

	const minimapCtx = minimapCanvas.value.getContext("2d");
	if (!minimapCtx) return;

	// Clear minimap
	minimapCtx.clearRect(0, 0, minimapSize.width, minimapSize.height);

	// Draw main canvas content onto minimap
	minimapCtx.drawImage(
		props.mainCanvas,
		0,
		0,
		minimapSize.width,
		minimapSize.height,
	);

	// Draw viewport rectangle
	minimapCtx.strokeStyle = "red";
	minimapCtx.lineWidth = 2;
	const scaleX = minimapSize.width / props.mainCanvas.width;
	const scaleY = minimapSize.height / props.mainCanvas.height;

	minimapCtx.strokeRect(
		props.viewport.x * scaleX,
		props.viewport.y * scaleY,
		props.viewport.width * scaleX,
		props.viewport.height * scaleY,
	);
};

onMounted(() => {
	drawMinimap();
});

watch(
	() => [props.mainCanvas, props.viewport],
	() => {
		drawMinimap();
	},
	{ deep: true },
);

// Expose for parent to call
defineExpose({ drawMinimap });
</script>

<template>
  <div class="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
    <canvas ref="minimapCanvas" :width="minimapSize.width" :height="minimapSize.height"></canvas>
  </div>
</template>
