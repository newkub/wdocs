<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
	cols: {
		default: 3,
		type: Number,
	},
	gap: {
		default: "1rem",
		type: String,
	},
});

const masonryRef = ref<HTMLElement | null>(null);

const layoutMasonry = () => {
	if (!masonryRef.value) return;

	const items = Array.from(masonryRef.value.children) as HTMLElement[];
	if (items.length === 0) return;

	// Reset heights
	items.forEach((item) => {
		item.style.gridRowEnd = "";
	});

	nextTick(() => {
		if (!masonryRef.value) return;
		
		const style = window.getComputedStyle(masonryRef.value);
		const rowHeight = parseInt(style.getPropertyValue("grid-auto-rows"), 10);
		const rowGap = parseInt(style.getPropertyValue("grid-row-gap"), 10);
		
		items.forEach((item) => {
			const rowSpan = Math.ceil(
				(item.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap),
			);
			item.style.gridRowEnd = `span ${rowSpan}`;
		});
	});
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
	layoutMasonry();

	// Re-layout when items change size
	resizeObserver = new ResizeObserver(() => {
		layoutMasonry();
	});

	if (masonryRef.value) {
		resizeObserver.observe(masonryRef.value);
	}

	window.addEventListener("resize", layoutMasonry);
});

onUnmounted(() => {
	if (resizeObserver) {
		resizeObserver.disconnect();
	}
	window.removeEventListener("resize", layoutMasonry);
});
</script>

<template>
  <div
    ref="masonryRef"
    class="masonry-grid"
    :style="{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridAutoRows: '10px',
      gap: gap
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.masonry-grid > * {
  break-inside: avoid;
}
</style>
