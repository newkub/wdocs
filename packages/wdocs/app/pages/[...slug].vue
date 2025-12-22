<script setup lang="ts">
import { ref } from 'vue'
import type { PageData } from '../../shared/types'

const mainEl = ref<HTMLElement | null>(null)
useCodeCopy(mainEl)

const route = useRoute()
const { data: _page, error } = await useAsyncData<PageData>(`content-${route.path}`, () => {
  const slug = (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug) || 'index'
  return $fetch<PageData>(`/api/content/${slug}`)
})

if (error.value) {
  console.error('Error fetching content:', error.value)
}
</script>

<template>
  <div class="flex">
    <div class="flex-1 w-0">
      <template v-if="_page">
        <ApiDocsLayout v-if="_page.frontmatter.api" :page="_page" />
        <main ref="mainEl" v-else class="prose dark:prose-invert max-w-none">
          <div v-html="_page.html"></div>
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <a :href="`https://github.com/your-repo/wdocs/edit/main/docs/content/${_page.slug}.md`" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
              Edit this page on GitHub
            </a>
          </div>
        </main>
      </template>
      <div v-else-if="error">Error loading content.</div>
      <div v-else>Loading...</div>
    </div>
    <aside class="hidden lg:block w-64 flex-shrink-0 pl-8">
      <div class="sticky top-16">
        <TableOfContents v-if="_page && _page.toc" :headings="_page.toc" />
      </div>
    </aside>
  </div>
</template>