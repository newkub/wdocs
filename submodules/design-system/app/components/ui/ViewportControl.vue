<script setup lang="ts">
import { computed, ref } from "vue";

interface Viewport {
	name: string;
	icon: string;
	width: string;
}

const props = defineProps<{
	modelValue?: string;
}>();

const emit = defineEmits<(e: "update:modelValue", value: string) => void>();

const activeViewport = computed({
	get: () => props.modelValue || "desktop",
	set: (value) => emit("update:modelValue", value),
});

const viewports: Viewport[] = [
	{ icon: "i-mdi-cellphone", name: "mobile", width: "375px" },
	{ icon: "i-mdi-tablet", name: "tablet", width: "768px" },
	{ icon: "i-mdi-monitor", name: "desktop", width: "100%" },
];

const previewStyle = computed(() => {
	const viewport = viewports.find((vp) => vp.name === activeViewport.value);
	return {
		maxWidth: "100%",
		width: viewport?.width || "100%",
	};
});

defineExpose({
	previewStyle,
});
</script>

<template>
  <div class="flex items-center rounded-lg p-1 bg-gray-100">
    <button
      v-for="vp in viewports"
      :key="vp.name"
      class="p-2 rounded-md transition-all duration-200 flex items-center justify-center"
      :class="[
        activeViewport === vp.name
          ? 'bg-white text-primary-600 shadow-sm'
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200',
      ]"
      @click="activeViewport = vp.name"
    >
      <div :class="[vp.icon, 'text-lg']" />
    </button>
  </div>
</template>