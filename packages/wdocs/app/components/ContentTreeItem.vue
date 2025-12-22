<script setup lang="ts">
import type { ContentItem } from '../../shared/types'

defineProps<{ item: ContentItem }>()
</script>

<template>
  <li>
    <NuxtLink v-if="!item.children" :to="item.path" class="block px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
      {{ item.title }}
    </NuxtLink>
    <div v-else>
      <span class="font-semibold">{{ item.title }}</span>
      <ContentTree :items="item.children" />
    </div>
  </li>
</template>
