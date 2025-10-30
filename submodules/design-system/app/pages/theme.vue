<script setup lang="ts">
import { useTheme } from '../../composables/useTheme'

const { theme, setTheme } = useTheme()

const themes = [
  { name: 'Light', value: 'light' },
  { name: 'Dark', value: 'dark' },
  { name: 'System', value: 'system' }
]
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Theme Customization</h1>
    
    <div class="space-y-4">
      <div class="border rounded-lg p-4">
        <h2 class="text-lg font-medium mb-2">Select Theme</h2>
        
        <div class="flex gap-2">
          <button
            v-for="t in themes"
            :key="t.value"
            @click="setTheme(t.value)"
            class="px-4 py-2 rounded border"
            :class="{
              'bg-blue-500 text-white border-blue-500': theme === t.value,
              'hover:bg-gray-100': theme !== t.value
            }"
          >
            {{ t.name }}
          </button>
        </div>
      </div>
      
      <div class="border rounded-lg p-4">
        <h2 class="text-lg font-medium mb-2">Custom Variables</h2>
        <p>Override CSS variables in your app:</p>
        <code class="bg-gray-100 p-2 rounded block mt-2">
          :root {
            --primary: #3b82f6;
            --primary-dark: #1d4ed8;
          }
        </code>
      </div>
    </div>
  </div>
</template>