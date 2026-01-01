<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'

const tabs = ref<string[]>([])
const activeTab = ref<string | null>(null)

provide('tabs', tabs)
provide('activeTab', activeTab)

function _selectTab(tab: string) {
  activeTab.value = tab
}

onMounted(() => {
  if (tabs.value.length > 0 && tabs.value[0]) {
    activeTab.value = tabs.value[0]
  }
})
</script>

<template>
  <div class="my-4 bg-gray-900 rounded-lg overflow-hidden">
    <div class="bg-gray-800 px-4 flex gap-2">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="_selectTab(tab)"
        class="py-2 px-3 text-sm font-medium border-b-2 transition-colors"
        :class="[
          activeTab === tab
            ? 'border-primary-500 text-white'
            : 'border-transparent text-gray-400 hover:text-white'
        ]"
      >
        {{ tab }}
      </button>
    </div>
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
