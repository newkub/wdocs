<template>
  <div class="chart-container">
    <div 
      v-for="(item, index) in data" 
      :key="index"
      class="chart-bar"
      :style="{ height: `${item.value}%`, backgroundColor: item.color }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: { 
    type: Array as () => Array<{ value: number; label: string; color: string }>,
    required: true 
  }
})
</script>

<style scoped>
.chart-container {
  display: flex;
  height: 200px;
  align-items: flex-end;
  gap: 4px;
}
.chart-bar {
  flex: 1;
  transition: height 0.3s ease;
}
</style>
