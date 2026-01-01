<script setup lang="ts">
import type { ApiParameter } from '~/shared/types'

defineProps<{
  parameters: ApiParameter[]
}>()
</script>

<template>
  <div class="my-8">
    <h3 class="text-xl font-semibold mb-4">Parameters</h3>
    <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">In</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="param in parameters" :key="param.name">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ param.name }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ param.schema.type }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ param.in }}</td>
            <td class="px-4 py-4">
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ param.description }}</p>
              <div class="text-xs mt-1 space-x-2">
                <span v-if="param.required" class="font-bold text-red-500">Required</span>
                <span v-if="param.schema.default" class="text-gray-500 dark:text-gray-400">Default: <code>{{ param.schema.default }}</code></span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
