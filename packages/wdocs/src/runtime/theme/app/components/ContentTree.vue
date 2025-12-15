<script setup lang="ts">
interface ContentItem {
  name: string;
  path: string;
  children?: ContentItem[];
}

defineProps<{ items: ContentItem[] }>()
</script>

<template>
  <ul class="pl-4">
    <li v-for="item in items" :key="item.path">
      <NuxtLink v-if="!item.children" :to="item.path" class="block px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
        {{ item.name }}
      </NuxtLink>
      <div v-else>
        <span class="font-semibold">{{ item.name }}</span>
        <ContentTree :items="item.children" />
      </div>
    </li>
  </ul>
</template>
