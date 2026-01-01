<script setup lang="ts">
import type { Frontmatter } from '../../shared/types'

defineProps<{
  frontmatter: Frontmatter
}>()
</script>

<template>
  <div class="mb-8">
    <div v-if="frontmatter.cover" class="h-48 rounded-lg bg-cover bg-center mb-4" :style="{ backgroundImage: `url(${frontmatter.cover})` }"></div>
    <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{{ frontmatter.title }}</h1>
    <p v-if="frontmatter.description" class="mt-2 text-lg text-gray-500 dark:text-gray-400">{{ frontmatter.description }}</p>
  </div>
</template>
