<script setup lang="ts">
import { useTheme } from '../../composables/useTheme'
import { useBreakpoints } from '../../composables/useBreakpoints'

const { theme, toggleTheme } = useTheme()
const { breakpoint } = useBreakpoints()
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Composables</h1>
    
    <div class="space-y-4">
      <div class="border rounded-lg p-4">
        <h2 class="text-lg font-medium mb-2">useTheme</h2>
        <p>Current theme: {{ theme }}</p>
        <button 
          @click="toggleTheme"
          class="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Toggle Theme
        </button>
      </div>
      
      <div class="border rounded-lg p-4">
        <h2 class="text-lg font-medium mb-2">useBreakpoints</h2>
        <p>Current breakpoint: {{ breakpoint }}</p>
      </div>
    </div>
  </div>
</template>