<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur md:px-8 flex items-center justify-between px-4 sm:px-6">
    <div class="flex items-center gap-4">
      <MobileMenuButton />
      <Logo />
    </div>
    <div class="flex items-center justify-end flex-1">
        <div class="flex items-center md:gap-8">
          <AppHeaderNav />
          <div class="flex items-center gap-4">
            <AppHeaderSearch />
            <ThemeToggle />
            <SocialLinks />
          </div>
        </div>
      </div>
  </header>
</template>
