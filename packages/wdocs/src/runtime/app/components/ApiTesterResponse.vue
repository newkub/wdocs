<script setup lang="ts">
interface ApiResponse {
  status: number
  data: unknown
}

defineProps<{ response: ApiResponse | null }>()
</script>

<template>
  <div v-if="response" class="mt-6">
    <h4 class="font-semibold">Response</h4>
    <div class="mt-2 p-4 rounded-md text-sm" :class="[response.status >= 400 ? 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800' : 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800']">
      <p class="font-semibold mb-2" :class="[response.status >= 400 ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200']">Status: {{ response.status }}</p>
      <pre class="overflow-x-auto text-xs"><code>{{ JSON.stringify(response.data, null, 2) }}</code></pre>
    </div>
  </div>
</template>
