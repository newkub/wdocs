<script setup lang="ts">
import { ref } from "vue";

const model = defineModel<string>();
</script>

<template>
  <div class="relative w-full">
    <div class="i-mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    <input 
      v-model="model"
      type="text" 
      placeholder="Search..."
      class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary"
    />
    <div class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 border border-gray-300 rounded px-1.5 py-0.5">
      Ctrl K
    </div>
  </div>
</template>
