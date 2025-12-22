<script setup lang="ts">
import type { PageData } from '../../shared/types'

defineProps<{
  page: PageData
}>()
</script>

<template>
  <div class="flex flex-col lg:flex-row">
    <div class="w-full lg:w-1/2 lg:pr-8">
      <h1 class="text-3xl font-bold mb-2">{{ page.frontmatter.title || page.slug }}</h1>
      <p class="text-lg text-gray-500 dark:text-gray-400 mb-8">{{ page.frontmatter.description }}</p>
      <div class="prose dark:prose-invert max-w-none" v-html="page.html"></div>
      <ApiParameters v-if="page.frontmatter.parameters" :parameters="page.frontmatter.parameters" />
      <ApiResponses v-if="page.frontmatter.responses" :responses="page.frontmatter.responses" />
    </div>
    <div class="w-full lg:w-1/2 lg:pl-8 mt-8 lg:mt-0">
      <div class="sticky top-24">
        <ApiTester 
          v-if="page.frontmatter.api && page.frontmatter.method && page.frontmatter.path"
          :method="page.frontmatter.method" 
          :path="page.frontmatter.path" 
          :parameters="page.frontmatter.parameters" 
        />
        <div v-else class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <p class="font-semibold">API Tester</p>
          <p class="text-sm text-gray-500">Coming soon...</p>
        </div>
      </div>
    </div>
  </div>
</template>