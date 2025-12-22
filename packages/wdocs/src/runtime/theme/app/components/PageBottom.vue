<script setup lang="ts">
import { useNavigation } from '../composables/useNavigation'

defineProps<{
  editPageUrl: string | null
  lastUpdated: string | null
}>()

const { prevPage: _prevPage, nextPage: _nextPage } = useNavigation()
const { wdocs: _wdocs } = useAppConfig()
</script>

<template>
  <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center mb-6 text-sm">
      <a v-if="editPageUrl" :href="editPageUrl" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        {{ _wdocs.editPage.text }}
      </a>
      <p v-if="lastUpdated" class="text-gray-500">Last updated on {{ lastUpdated }}</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink v-if="_prevPage" :to="_prevPage.link" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
        <p class="text-xs text-gray-500">Previous</p>
        <p class="font-medium text-gray-800 dark:text-gray-200">{{ _prevPage.text }}</p>
      </NuxtLink>
      <div v-else></div>
      <NuxtLink v-if="_nextPage" :to="_nextPage.link" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-right">
        <p class="text-xs text-gray-500">Next</p>
        <p class="font-medium text-gray-800 dark:text-gray-200">{{ _nextPage.text }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
