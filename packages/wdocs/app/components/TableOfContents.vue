<script setup lang="ts">
import type { Heading } from '../../shared/types'

const props = defineProps<{
  headings: Heading[]
}>()

const activeId = ref<string | null>(null)
const observer = ref<IntersectionObserver | null>(null)

onMounted(() => {
  if (props.headings.length === 0) return

  observer.value = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '0px 0px -80% 0px' }
  )

  for (const section of document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')) {
    observer.value?.observe(section)
  }
})

onUnmounted(() => {
  observer.value?.disconnect()
})

const _isActive = (id: string) => activeId.value === id

const _paddingClass = (level: number) => `pl-[${(level - 1) * 0.75}rem]`;
</script>

<template>
  <div v-if="headings && headings.length" class="sticky top-20">
    <p class="font-semibold mb-2 text-sm text-gray-800 dark:text-gray-200">On this page</p>
    <ul class="space-y-1">
      <li v-for="heading in headings" :key="heading.slug">
        <ul :class="{ 'ml-4': heading.depth > 2 }">
          <li>
            <a
              :href="`#${heading.slug}`"
              class="block text-sm transition-colors duration-200"
              :class="[
                _paddingClass(heading.depth),
                _isActive(heading.slug)
                  ? 'text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
              ]"
            >
              {{ heading.title }}
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
