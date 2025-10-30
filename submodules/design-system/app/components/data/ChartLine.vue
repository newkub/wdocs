<template>
  <svg class="chart-line" :viewBox="`0 0 ${width} ${height}`">
    <polyline
      fill="none"
      stroke="var(--primary)"
      stroke-width="2"
      :points="points"
    />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps({
  data: { type: Array as () => number[], required: true },
  width: { type: Number, default: 300 },
  height: { type: Number, default: 150 }
})

const points = computed(() => {
  return props.data
    .map((value, index) => {
      const x = (index / (props.data.length - 1)) * props.width
      const y = props.height - (value / 100) * props.height
      return `${x},${y}`
    })
    .join(' ')
})
</script>

<style scoped>
.chart-line {
  width: 100%;
  height: 100%;
}
</style>
