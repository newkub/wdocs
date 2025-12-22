<script setup lang="ts">

const { wdocs } = useAppConfig()
const route = useRoute()

const _navigation = computed(() => {
  if (!wdocs || !wdocs.sidebar) return []
  const path = route.path.split('/')[1]
  return wdocs.sidebar[`/${path}/`] || []
})
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
    <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
      <Logo />
    </div>
    <nav class="flex-grow p-4 overflow-y-auto">
      <ul v-if="_navigation && _navigation.length" class="space-y-1">
        <template v-for="group in _navigation" :key="group.text">
          <li class="font-semibold text-sm tracking-wider text-gray-900 dark:text-white pt-4 pb-2">{{ group.text }}</li>
          <NavItem v-for="item in group.items" :key="item.link" :item="item" />
        </template>
      </ul>
      <p v-else class="text-center text-gray-500">No navigation found.</p>
    </nav>
  </div>
</template>
