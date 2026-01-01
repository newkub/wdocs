<script setup lang="ts">
defineProps<{ command: string }>()
</script>

<template>
  <div class="code-block-wrapper relative group">
    <pre class="bg-gray-900 text-white p-4 rounded-md text-sm overflow-x-auto"><code>{{ command }}</code></pre>
    <button class="copy-code-button absolute top-2 right-2 p-1.5 rounded-md bg-gray-800/70 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" :data-code="command">
      Copy
    </button>
  </div>
</template>
