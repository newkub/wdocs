<script setup lang="ts">
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Get Started</h1>
    
    <div class="space-y-6">
      <div class="border rounded-lg p-4">
        <h2 class="text-lg font-medium mb-2">Installation</h2>
        <code class="bg-gray-100 p-2 rounded block">bun add @wrikka/design-system</code>
      </div>
      
      <div class="border rounded-lg p-4">
        <h2 class="text-lg font-medium mb-2">Usage</h2>
        <p class="mb-2">Import components directly in your Vue files:</p>
        <code class="bg-gray-100 p-2 rounded block mb-4">
          &lt;script setup&gt;
          import { Button } from '@wrikka/design-system'
          &lt;/script&gt;
        </code>
        
        <p class="mb-2">Or import composables:</p>
        <code class="bg-gray-100 p-2 rounded block">
          import { useTheme } from '@wrikka/design-system'
        </code>
      </div>
      
      <div class="border rounded-lg p-4">
        <h2 class="text-lg font-medium mb-2">Theme Setup</h2>
        <p>Import the theme CSS in your main.ts:</p>
        <code class="bg-gray-100 p-2 rounded block mt-2">
          import '@wrikka/design-system/theme.css'
        </code>
      </div>
    </div>
  </div>
</template>