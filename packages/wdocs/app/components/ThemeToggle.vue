<script setup lang="ts">
const themes = useThemes()
</script>

<template>
  <button v-if="themes.currentTheme.value" @click="themes.cycleThemes" class="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
    <Icon :name="themes.currentTheme.value.icon" class="w-5 h-5" />
  </button>
</template>
