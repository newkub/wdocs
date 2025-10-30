<template>
  <div class="flex items-center justify-between">
    <button 
      :disabled="currentPage <= 1"
      @click="prevPage"
      class="px-4 py-2 rounded-md"
    >
      Previous
    </button>
    
    <div class="flex gap-2">
      <button 
        v-for="page in pages" 
        :key="page"
        @click="goToPage(page)"
        class="px-4 py-2 rounded-md"
        :class="{ 'bg-primary text-white': page === currentPage }"
      >
        {{ page }}
      </button>
    </div>
    
    <button 
      :disabled="currentPage >= totalPages"
      @click="nextPage"
      class="px-4 py-2 rounded-md"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  totalItems: { type: Number, required: true },
  itemsPerPage: { type: Number, default: 10 },
  currentPage: { type: Number, default: 1 }
})

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

const emit = defineEmits(['update:currentPage'])

const prevPage = () => emit('update:currentPage', props.currentPage - 1)
const nextPage = () => emit('update:currentPage', props.currentPage + 1)
const goToPage = (page: number) => emit('update:currentPage', page)
</script>
