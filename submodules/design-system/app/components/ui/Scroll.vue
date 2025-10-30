<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		maxHeight?: string;
	}>(),
	{
		maxHeight: "80",
	},
);
</script>

<template>
  <div class="overflow-y-auto" :class="[`max-h-${props.maxHeight}`]">
    <slot />
  </div>
</template>
