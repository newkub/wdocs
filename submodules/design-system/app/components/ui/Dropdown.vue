<template>
  <div class="relative inline-block">
    <slot name="trigger" />
    <div 
      v-show="isOpen"
      class="absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)

defineExpose({ isOpen })
</script>
