<script setup lang="ts">
import { useTableOfContents } from '~/composables/useTableOfContents'

// The page component will provide the headings, this component just displays them.
// The active slug is tracked within the composable itself.
const { headings, activeHeadingSlug: _activeHeadingSlug } = useTableOfContents(ref([])) // Pass empty ref as it will be populated by the page

import type { Heading } from '~/shared/types'

const _filteredHeadings = computed(() => headings.value.filter((h: Heading) => h.depth > 1))
</script>

<template>
  <div v-if="_filteredHeadings.length" class="sticky top-24">
    <p class="font-semibold mb-2 text-sm text-gray-800 dark:text-gray-200">On this page</p>
    <ul class="space-y-1 text-sm">
      <li v-for="heading in _filteredHeadings" :key="heading.slug">
        <a
          :href="`#${heading.slug}`"
          class="block transition-colors duration-200"
          :style="{ paddingLeft: `${(heading.depth - 2) * 1}rem` }"
          :class="[
            _activeHeadingSlug === heading.slug
              ? 'text-primary-500 dark:text-primary-400 font-medium'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
          ]"
        >
          {{ heading.title }}
        </a>
      </li>
    </ul>
  </div>
</template>
