<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, navigateTo } from '#app'

const router = useRouter()
const route = useRoute()
const components = ref<Array<{name: string, path: string}>>([])

// Dynamic import all components
onMounted(async () => {
  const modules = import.meta.glob('../../components/**/*.vue')
  
  for (const path in modules) {
    const name = path.split('/').pop()?.replace('.vue', '') || ''
    components.value.push({ name, path })
  }
})

const previewComponent = (path: string) => {
  navigateTo({ 
    path: '/component-preview', 
    query: { component: path } 
  })
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">All Components ({{ components.length }})</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="(comp, index) in components" 
        :key="index"
        class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
        @click="previewComponent(comp.path)"
      >
        <div class="font-medium">{{ comp.name }}</div>
        <div class="text-sm text-gray-500 truncate">{{ comp.path }}</div>
      </div>
    </div>
  </div>
</template>