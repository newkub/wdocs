<script setup lang="ts">
import { computed } from "vue";

interface Props {
	text: string;
	position?: "top" | "bottom" | "left" | "right";
	delay?: number;
}

const props = withDefaults(defineProps<Props>(), {
	delay: 200,
	position: "top",
});

const positionClasses = computed(() => {
	switch (props.position) {
		case "bottom":
			return "top-full mt-2 left-1/2 -translate-x-1/2";
		case "left":
			return "right-full mr-2 top-1/2 -translate-y-1/2";
		case "right":
			return "left-full ml-2 top-1/2 -translate-y-1/2";
		default: // top
			return "bottom-full mb-2 left-1/2 -translate-x-1/2";
	}
});

const transitionDelay = computed(() => `${props.delay}ms`);
</script>

<template>
  <div class="relative group inline-block">
    <slot />
    <div
      :class="[
        'absolute w-max max-w-xs p-2 rounded-md shadow-lg text-sm bg-gray-900 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10',
        positionClasses,
      ]"
      :style="{ transitionDelay }"
    >
      {{ text }}
    </div>
  </div>
</template>

