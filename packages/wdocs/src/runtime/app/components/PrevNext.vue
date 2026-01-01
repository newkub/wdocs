<template>
  <div v-if="_prev || _next" class="flex border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
    <NuxtLink v-if="_prev" :to="_prev.link" class="flex flex-col items-start gap-2 w-1/2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
      <span class="text-sm text-gray-500">Previous</span>
      <span class="font-medium text-primary-500 dark:text-primary-400">{{ _prev.text }}</span>
    </NuxtLink>
    <NuxtLink v-if="_next" :to="_next.link" class="flex flex-col items-end gap-2 w-1/2 ml-auto p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
      <span class="text-sm text-gray-500">Next</span>
      <span class="font-medium text-primary-500 dark:text-primary-400">{{ _next.text }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation'

const { prev: _prev, next: _next } = useNavigation()
</script>
