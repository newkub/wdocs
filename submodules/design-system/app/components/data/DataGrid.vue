<template>
  <div class="grid-container">
    <div 
      v-for="(item, index) in data" 
      :key="index"
      class="grid-item"
    >
      <slot name="item" v-bind="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: { type: Array as () => any[], required: true },
  columns: { type: Number, default: 3 }
})
</script>

<style scoped>
.grid-container {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(v-bind(columns), 1fr);
}
.grid-item {
  border: 1px solid var(--border);
  padding: 1rem;
  border-radius: 0.5rem;
}
</style>
