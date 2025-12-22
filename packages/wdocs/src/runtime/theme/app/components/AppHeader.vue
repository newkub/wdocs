
<template>
  <header class="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
    <div class="flex items-center gap-4">
      <MobileMenuButton />
      <Logo />
    </div>
    <div class="flex items-center gap-4">
      <!-- Menu -->
      <AppHeaderNav />
      <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
      <!-- Search -->
      <AppHeaderSearch />
      <!-- Theme Toggle -->
      <ThemeToggle />
      <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
      <SocialLinks />
    </div>
  </header>
</template>
