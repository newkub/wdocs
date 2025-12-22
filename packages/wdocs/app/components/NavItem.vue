<script setup lang="ts">
import type { NavItem as NavItemType } from '../../shared/types'

const props = defineProps<{
  item: NavItemType
  activePath: string
  depth?: number
}>()

const _isActive = computed(() => props.activePath === props.item.link)
const _paddingLeft = computed(() => `${(props.depth || 0) * 0.75}rem`)
</script>

<template>
  <li>
    <NuxtLink
      :to="item.link"
      class="flex items-center justify-between rounded-md py-1 transition-colors duration-150"
      :style="{ paddingLeft: _paddingLeft }"
      :class="[
        _isActive
          ? 'text-primary-500 font-medium'
          : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
      ]"
    >
      <span>{{ item.text }}</span>
      <span v-if="item.method" class="text-xs font-semibold px-1.5 rounded-full"
        :class="{
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': item.method === 'GET',
          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': item.method === 'POST',
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': item.method === 'PUT' || item.method === 'PATCH',
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': item.method === 'DELETE',
        }"
      >
        {{ item.method }}
      </span>
    </NuxtLink>
    <ul v-if="item.children && item.children.length" class="mt-1">
      <NavItem
        v-for="child in item.children"
        :key="child.link"
        :item="child"
        :active-path="props.activePath"
        :depth="(props.depth || 0) + 1"
      />
    </ul>
  </li>
</template>