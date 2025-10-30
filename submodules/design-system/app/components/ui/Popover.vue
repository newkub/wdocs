<script setup lang="ts">
import { provide, ref } from "vue";

const isOpen = ref(false);

provide("popover-is-open", isOpen);

function toggle() {
	isOpen.value = !isOpen.value;
}

defineExpose({ toggle });
</script>

<template>
  <div class="relative inline-block">
    <slot />
  </div>
</template>
