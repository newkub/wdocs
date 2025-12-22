<script setup lang="ts">
const { wdocs: _wdocs } = useAppConfig()
</script>

<template>
  <nav v-if="_wdocs.header" class="hidden md:flex gap-2">
    <NuxtLink
      v-for="item in _wdocs.header.nav"
      :key="item.link"
      :to="item.link"
      class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {{ item.text }}
    </NuxtLink>
  </nav>
</template>
