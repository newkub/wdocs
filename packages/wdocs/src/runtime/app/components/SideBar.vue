<script setup lang="ts">
import type { NavItem as NavItemType } from '../../shared/types'

const { wdocs } = useAppConfig()
const _route = useRoute()

const { data: _navigation, error } = await useAsyncData<NavItemType[]>('navigation', () => {
  return $fetch<NavItemType[]>('/api/navigation')
})

if (error?.value) {
  console.error('Error fetching navigation:', error.value)
}

const _hasHeaderNav = computed(() => (wdocs.header?.nav?.length ?? 0) > 0)
</script>

<template>
  <nav class="p-4 text-sm flex flex-col h-full">
    <!-- Header Nav for Mobile -->
    <div v-if="_hasHeaderNav" class="mb-4">
      <ul class="space-y-1">
        <li v-for="item in wdocs.header?.nav" :key="item.text">
          <NuxtLink v-if="item.link" :to="item.link" class="block py-1 font-medium">
            {{ item.text }}
          </NuxtLink>
          <div v-else>
            <p class="py-1 font-medium text-gray-400">{{ item.text }}</p>
            <ul v-if="item.items" class="pl-2 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700">
              <li v-for="subItem in item.items" :key="subItem.link">
                <NuxtLink :to="subItem.link" class="block py-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                  {{ subItem.text }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h3 class="font-semibold text-gray-500 dark:text-gray-400 mb-2">Contents</h3>
    </div>

    <!-- Content Navigation -->
    <div class="flex-1 overflow-y-auto">
      <ul v-if="_navigation" class="space-y-1">
        <NavItem v-for="item in _navigation" :key="item.link" :item="item" :active-path="_route.path" />
      </ul>
      <div v-else-if="error">Error loading navigation.</div>
      <div v-else>Loading navigation...</div>
    </div>
  </nav>
</template>
