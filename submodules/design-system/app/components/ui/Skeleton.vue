<script setup lang="ts">
interface Props {
	class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div :class="['animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-300', props.class]" />
</template>