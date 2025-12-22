<template>
  <div class="antialiased text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 min-h-screen">
    <Header />
    <div class="container mx-auto flex px-4 sm:px-6 md:px-8">
      <!-- Desktop Sidebar -->
      <aside class="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <SideBar />
      </aside>

      <!-- Mobile Sidebar -->
      <div v-if="_isMobileNavOpen" class="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900">
        <SideBar />
      </div>

      <main class="flex-1 p-8 w-full md:w-[calc(100%-16rem)]">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isMobileNavOpen: _isMobileNavOpen } = useMobileNav()
</script>
