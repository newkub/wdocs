<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead, useSeoMeta } from '#imports'

const route = useRoute()
const { data: contents } = await useAsyncData('contents', () => $fetch('/api/content'))

const page = computed(() => {
  return contents.value?.find(item => item.path === route.path)
})

// Default values
const siteName = 'WDocs'
const defaultDescription = 'A documentation site.'
const defaultImage = '/og-image.png' // A default image for social media

const title = computed(() => page.value?.title || siteName)
const description = computed(() => page.value?.description || defaultDescription)
const image = computed(() => page.value?.image || defaultImage)
const favicon = computed(() => page.value?.favicon || '/favicon.ico')

useHead({
  title,
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: favicon
    }
  ]
})

useSeoMeta({
  title: title.value,
  description: description.value,
  ogTitle: page.value?.['og:title'] || title.value,
  ogDescription: page.value?.['og:description'] || description.value,
  ogImage: image.value,
  ogType: page.value?.['og:type'] || 'article',
  twitterCard: page.value?.['twitter:card'] || 'summary_large_image',
  twitterCreator: page.value?.['twitter:creator']
})
</script>

<template>
  <div class="flex flex-col h-screen font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <AppHeader />
    <div class="grid grid-cols-[240px_1fr_240px] flex-grow">
    <aside class="border-r border-gray-200 dark:border-gray-800 p-4">
      <SideMenu />
    </aside>
    <main class="p-4 overflow-y-auto">
      <slot name="before-content" />
      <slot />
      <slot name="after-content" />
    </main>
    <aside class="border-l border-gray-200 dark:border-gray-800 p-4">
      <TableOfContents />
    </aside>
    </div>
  </div>
</template>
