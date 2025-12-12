<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import type { SearchResult } from '../types/docs/search';

const searchQuery = ref('');
const searchResults = ref<SearchResult[]>([]);
const isSearchOpen = ref(false);

const search = async () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    isSearchOpen.value = false;
    return;
  }

  const { data } = await useFetch<SearchResult[]>('/api/docs/search', {
    params: { q: searchQuery.value },
  });

  if (data.value) {
    searchResults.value = data.value;
    isSearchOpen.value = true;
  }
};

const debouncedSearch = useDebounceFn(search, 300);

watch(searchQuery, debouncedSearch);

const closeSearch = () => {
  isSearchOpen.value = false;
};
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-gray-900 dark:text-white">Wrikka Docs</NuxtLink>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative" v-on-click-outside="closeSearch">
            <input v-model="searchQuery" type="text" placeholder="Search docs..." class="input w-64" />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <i class="i-mdi-magnify text-gray-400"></i>
            </div>
            <div v-if="isSearchOpen && searchResults.length" class="absolute mt-1 w-64 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10">
              <ul>
                <li v-for="result in searchResults" :key="result.path">
                  <NuxtLink :to="result.path" @click="closeSearch" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">{{ result.title }}</NuxtLink>
                </li>
              </ul>
            </div>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  </nav>
</template>
