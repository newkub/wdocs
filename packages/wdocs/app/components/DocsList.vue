<template>
  <ul class="space-y-2">
    <li v-for="item in navigation" :key="item._path">
      <NuxtLink :to="item._path" class="block px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">{{ item.title }}</NuxtLink>
      <DocsList v-if="item.children" :navigation="item.children" class="pl-4 mt-2" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { NavigationItem } from '../types/docs/navigation';

defineProps<{
	navigation: NavigationItem[];
}>();
</script>
