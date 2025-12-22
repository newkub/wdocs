<script setup lang="ts">
import type { PageContent } from '../../shared/types/content'
import { useMobileNav } from '../composables/useMobileNav'
import { useTableOfContents } from '../composables/useTableOfContents'
import { usePageData } from '../composables/usePageData'
import { usePageSeo } from '../composables/usePageSeo'
import { useCodeCopy } from '../composables/useCodeCopy'

const { isMobileNavOpen: _isMobileNavOpen } = useMobileNav()
const { headings: _headings, onHeadings: _onHeadings } = useTableOfContents()

const { data: contents } = await useAsyncData('contents', () => $fetch<PageContent[]>('/api/content'))

const { page, editPageUrl: _editPageUrl, lastUpdated: _lastUpdated } = usePageData(contents)
usePageSeo(page)


const mainEl = ref<HTMLElement | null>(null)
useCodeCopy(mainEl)

</script>

<template>
  <div class="flex flex-col h-screen font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <AppHeader />
    <div class="flex-grow md:grid md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_240px]">
      <aside v-if="_isMobileNavOpen" class="md:hidden fixed inset-0 z-20 bg-white dark:bg-gray-900 p-4">
        <SideMenu />
      </aside>
      <aside class="hidden md:block border-r border-gray-200 dark:border-gray-800 p-4">
        <SideMenu />
      </aside>
      <main ref="mainEl" class="p-4 overflow-y-auto">
        <slot name="before-content" />
        <slot :onHeadings="_onHeadings" />
        <slot name="after-content" />
<PageBottom :edit-page-url="_editPageUrl" :last-updated="_lastUpdated" />
      </main>
      <aside class="hidden lg:block border-l border-gray-200 dark:border-gray-800 p-4">
        <TableOfContents :headings="_headings" />
      </aside>
    </div>
  </div>
</template>
