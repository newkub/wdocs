<script setup lang="ts">
import { computed } from "vue";

interface Props {
	min?: number;
	max?: number;
	step?: number;
	disabled?: boolean;
	class?: string;
}

const props = withDefaults(defineProps<Props>(), {
	disabled: false,
	max: 100,
	min: 0,
	step: 1,
});

const model = defineModel<number[]>();

const percentageLeft = computed(() => {
	if (!model.value || !model.value[0]) return "0%";
	return `${((model.value[0] - props.min) / (props.max - props.min)) * 100}%`;
});

const percentageRight = computed(() => {
	if (!model.value || !model.value[0]) return "100%";
	const val = model.value.length > 1 ? model.value[1] : model.value[0];
	if (val === undefined) return "100%";
	return `${100 - ((val - props.min) / (props.max - props.min)) * 100}%`;
});
</script>

<template>
  <div :class="['relative flex w-full touch-none select-none items-center', props.disabled && 'opacity-50', props.class]">
    <div class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <div class="absolute h-full bg-primary" :style="{ left: percentageLeft, right: percentageRight }" />
    </div>
    <span
      v-for="(thumb, index) in model"
      :key="index"
      class="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      :style="{ left: `calc(${((thumb - props.min) / (props.max - props.min)) * 100}% - 0.5rem)` }"
    />
  </div>
</template>
