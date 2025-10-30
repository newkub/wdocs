<template>
  <div class="stats-card">
    <div class="stats-value">{{ value }}</div>
    <div class="stats-label">{{ label }}</div>
    <div 
      v-if="trend" 
      class="stats-trend"
      :class="{ 'up': trend > 0, 'down': trend < 0 }"
    >
      {{ Math.abs(trend) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  value: { type: [String, Number], required: true },
  label: { type: String, required: true },
  trend: { type: Number, default: 0 }
})
</script>

<style scoped>
.stats-card {
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--background);
  border: 1px solid var(--border);
}
.stats-value {
  font-size: 1.5rem;
  font-weight: bold;
}
.stats-label {
  color: var(--text-secondary);
}
.stats-trend {
  margin-top: 0.5rem;
}
.stats-trend.up {
  color: var(--success);
}
.stats-trend.down {
  color: var(--danger);
}
</style>
