<script setup lang="ts">
import type { NavItem as NavItemType } from '../../shared/types'

const { data: _navigation, error } = await useAsyncData<NavItemType[]>('navigation', () => {
  return $fetch<NavItemType[]>('/api/navigation')
})

if (error.value) {
  console.error('Error fetching navigation:', error.value)
}

const _route = useRoute()
</script>

<template>
  <nav class="p-4 text-sm">
    <ul v-if="_navigation" class="space-y-1">
      <NavItem v-for="item in _navigation" :key="item.link" :item="item" :active-path="_route.path" />
    </ul>
    <div v-else-if="error">Error loading navigation.</div>
    <div v-else>Loading navigation...</div>
  </nav>
</template>
