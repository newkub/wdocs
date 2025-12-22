<template>
  <button @click="$colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'" class="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
    <Icon v-if="$colorMode.value === 'dark'" name="mdi:white-balance-sunny" class="w-5 h-5" />
    <Icon v-else name="mdi:weather-night" class="w-5 h-5" />
  </button>
</template>
