<script setup lang="ts">
import type { ContentItem } from '../../shared/types'

defineProps<{ item: ContentItem }>()

const isCollapsed = ref(false)

function _toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <li>
    <NuxtLink v-if="!item.children" :to="item.path" class="block px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
      {{ item.title }}
    </NuxtLink>
    <div v-else>
      <div @click="_toggleCollapse" class="flex justify-between items-center cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
        <span class="font-semibold">{{ item.title }}</span>
        <svg 
          class="w-4 h-4 transform transition-transform duration-200"
          :class="{ 'rotate-90': !isCollapsed }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
      <ContentTree v-if="!isCollapsed" :items="item.children" />
    </div>
  </li>
</template>
