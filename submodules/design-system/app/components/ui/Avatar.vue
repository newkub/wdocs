

<template>
  <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
    <img
      v-if="props.src && !imageError"
      :src="props.src"
      :alt="props.alt"
      class="aspect-square h-full w-full"
      @error="imageError = true"
    >
    <span v-else class="flex h-full w-full items-center justify-center rounded-full bg-muted">
      <slot />
    </span>
  </span>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
	src?: string;
	alt?: string;
}

const props = defineProps<Props>();

const imageError = ref(false);

// Reset the error state if the src prop changes
watch(
	() => props.src,
	() => {
		imageError.value = false;
	},
);
</script>