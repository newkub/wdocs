<script setup lang="ts">
import { computed } from "vue";

interface Props {
	orientation?: "horizontal" | "vertical";
	class?: string;
}

const props = withDefaults(defineProps<Props>(), {
	orientation: "horizontal",
});

const separatorClasses = computed(() => {
	return [
		"shrink-0 bg-border",
		props.orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
		props.class,
	];
});
</script>

<template>
  <div :class="separatorClasses" />
</template>
