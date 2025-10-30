<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th 
            v-for="(header, index) in headers" 
            :key="index"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
          <td 
            v-for="(cell, cellIndex) in row" 
            :key="cellIndex"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps({
  headers: { type: Array as () => string[], required: true },
  rows: { type: Array as () => any[][], required: true }
})
</script>
