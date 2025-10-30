<script setup lang="ts">
interface Props {
	class?: string | string[] | Record<string, boolean>;
}

const props = defineProps<Props>();
</script>

<template>
  <div :class="['rounded-xl border bg-card text-card-foreground shadow', props.class]">
    <slot />
  </div>
</template>