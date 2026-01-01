<script setup lang="ts">
import type { ContentItem } from '../../shared/types'

defineProps<{ items: ContentItem[] }>()
</script>

<template>
  <ul class="pl-4">
    <ContentTreeItem v-for="item in items" :key="item.slug" :item="item" />
  </ul>
</template>
