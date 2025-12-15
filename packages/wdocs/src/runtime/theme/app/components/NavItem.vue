<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface NavItem {
  name: string;
  path: string;
  children?: NavItem[];
}

const props = withDefaults(defineProps<{
  item: NavItem
  depth?: number
}>(), {
  depth: 0,
})

const route = useRoute()
const isActive = computed(() => route.path === props.item.path)
</script>

<template>
  <li>
    <NuxtLink 
      :to="item.path"
      class="block text-sm rounded-md transition-colors duration-200"
      :class="isActive ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'"
      :style="{ paddingLeft: `${0.5 + (props.depth * 0.75)}rem`, paddingTop: '0.375rem', paddingBottom: '0.375rem' }"
    >
      {{ item.name }}
    </NuxtLink>
    <ul v-if="item.children && item.children.length" class="mt-1">
      <NavItem v-for="child in item.children" :key="child.path" :item="child" :depth="props.depth + 1" />
    </ul>
  </li>
</template>
