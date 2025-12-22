<script setup lang="ts">
import { ref } from 'vue'
import { useSearch } from '../composables/useSearch'

const { query: _query, results: _results } = useSearch()
const showResults = ref(false)

const _hideResults = () => {
  showResults.value = false
}

const _showResultsOnFocus = () => {
  showResults.value = true
}
</script>

<template>
  <div class="relative hidden sm:block">
    <input
      v-model="_query"
      type="text"
      placeholder="Search..."
      class="w-48 lg:w-64 bg-gray-100 dark:bg-gray-800 rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      @focus="_showResultsOnFocus"
    />
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
    </div>
    <div v-if="showResults && (_results.length > 0 || _query)" class="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
      <ul v-if="_results.length > 0" class="py-1">
        <li v-for="result in _results" :key="result.item.path">
          <NuxtLink :to="result.item.path" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <p class="font-semibold">{{ result.item.title }}</p>
            <p class="text-xs text-gray-500">{{ result.item.content }}</p>
          </NuxtLink>
        </li>
      </ul>
      <p v-else-if="_query" class="px-4 py-2 text-sm text-gray-500">No results found.</p>
    </div>
  </div>
</template>
