<script setup lang="ts">
import { useMobileNav } from '../composables/useMobileNav'

const { toggle: _toggle } = useMobileNav()
</script>

<template>
  <button @click="_toggle" class="md:hidden flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
    <Icon name="mdi:menu" class="w-5 h-5" />
  </button>
</template>
