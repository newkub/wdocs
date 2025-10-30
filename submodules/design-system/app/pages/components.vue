<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from '#imports'

const component = ref<any>(null)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const compPath = useRoute().query.component as string
    if (!compPath) throw new Error('No component specified')
    
    const module = await import(/* @vite-ignore */ compPath)
    component.value = module.default
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load component'
  }
})
</script>

<template>
  <div class="p-6">
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <component v-else :is="component" />
  </div>
</template>
