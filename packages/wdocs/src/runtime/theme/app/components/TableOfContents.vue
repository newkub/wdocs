<script setup lang="ts">
import { inject, ref, onMounted, onUnmounted } from 'vue'

interface Heading {
  level: number;
  text: string;
  id: string;
}

const headings = inject<Heading[]>('headings', [])
const activeId = ref<string | null>(null)

const observer = ref<IntersectionObserver | null>(null)

onMounted(() => {
  if (headings.length === 0) return;

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id;
        }
      });
    },
    { rootMargin: '0px 0px -80% 0px' }
  );

  document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach((section) => {
    observer.value?.observe(section);
  });
});

onUnmounted(() => {
  observer.value?.disconnect();
});

const isActive = (id: string) => activeId.value === id;
</script>

<template>
  <div v-if="headings && headings.length" class="sticky top-20">
    <p class="font-semibold mb-2 text-sm text-gray-800 dark:text-gray-200">On this page</p>
    <ul class="space-y-1">
      <li v-for="heading in headings" :key="heading.id">
        <a 
          :href="`#${heading.id}`" 
          class="block text-sm transition-colors duration-200"
          :class="isActive(heading.id) ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'"
          :style="{ 'padding-left': `${(heading.level - 1) * 0.75}rem` }"
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </div>
</template>
