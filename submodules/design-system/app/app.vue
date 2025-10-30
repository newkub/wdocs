<script setup lang="ts">
import { defineNuxtConfig } from '#imports'

defineNuxtConfig({
  routes: [
    {
      path: '/component-preview',
      component: () => import('./pages/components.vue')
    }
  ]
})
</script>

<template>
  <NuxtPage />
</template>