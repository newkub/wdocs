<script setup lang="ts">
const { wdocs: _wdocs } = useAppConfig()
</script>

<template>
  <a href="/" class="font-bold text-xl text-gray-900 dark:text-white">
    {{ _wdocs.title || 'MyLogo' }}
  </a>
</template>
