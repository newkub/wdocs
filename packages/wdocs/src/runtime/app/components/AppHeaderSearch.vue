<template>
  <div class="relative hidden sm:block">
    <input
      type="text"
      placeholder="Search..."
      class="w-48 lg:w-64 bg-gray-100 dark:bg-gray-800 rounded-md py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon name="mdi:magnify" class="w-5 h-5 text-gray-400" />
    </div>
  </div>
</template>
