<script setup lang="ts">
import type { ContentItem } from '../../shared/types/content'

defineProps<{ items: ContentItem[] }>()
</script>

<template>
  <ul class="pl-4">
    <ContentTreeItem v-for="item in items" :key="item.path" :item="item" />
  </ul>
</template>
