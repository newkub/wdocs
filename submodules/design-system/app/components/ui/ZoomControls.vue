<script setup lang="ts">
defineProps<{ zoomLevel: number }>();
const emit = defineEmits(["zoom-in", "zoom-out", "zoom-reset"]);
</script>

<template>
  <div class="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg flex items-center gap-2 border border-gray-200 z-10">
    <button class="p-2 rounded-md hover:bg-gray-100" @click="emit('zoom-out')">
      <div class="i-mdi-minus w-6 h-6" />
    </button>
    <button class="text-sm font-semibold w-16 text-center cursor-pointer" @click="emit('zoom-reset')">
      {{ Math.round(zoomLevel * 100) }}%
    </button>
    <button class="p-2 rounded-md hover:bg-gray-100" @click="emit('zoom-in')">
      <div class="i-mdi-plus w-6 h-6" />
    </button>
  </div>
</template>
