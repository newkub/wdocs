<script setup lang="ts">
const { wdocs: _wdocs } = useAppConfig()
</script>

<template>
  <a href="/" class="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
    <img src="/favicon.svg" alt="Logo" class="h-6 w-6">
    <span>{{ _wdocs.title || 'MyLogo' }}</span>
  </a>
</template>
