<script setup lang="ts">
interface Props {
	class?: string;
}

const props = defineProps<Props>();
const model = defineModel<number>();
</script>

<template>
  <div :class="['relative h-4 w-full overflow-hidden rounded-full bg-secondary', props.class]">
    <div
      class="h-full w-full flex-1 bg-primary transition-all"
      :style="`transform: translateX(-${100 - (model || 0)}%);`"
    />
  </div>
</template>
