<script setup lang="ts">
const { wdocs } = useAppConfig()
</script>

<template>
  <header class="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
    <div class="flex items-center gap-6">
      <!-- Logo -->
      <a href="/" class="font-bold text-xl text-gray-900 dark:text-white">MyLogo</a>
    </div>
    <div class="flex items-center gap-4">
      <!-- Menu -->
      <nav class="hidden md:flex gap-2">
        <NuxtLink v-for="item in wdocs.header.nav" :key="item.link" :to="item.link" class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">{{ item.text }}</NuxtLink>
      </nav>
      <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
      <!-- Search -->
      <div class="relative hidden sm:block">
        <input type="text" placeholder="Search..." class="w-48 lg:w-64 bg-gray-100 dark:bg-gray-800 rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <!-- Theme Toggle -->
      <ThemeToggle />
    </div>
  </header>
</template>
