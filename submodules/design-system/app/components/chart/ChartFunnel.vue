<script setup lang="ts">
interface DataPoint {
	label: string
	value: number
	color?: string
}

interface Props {
	data: DataPoint[]
	height?: number
}

const props = withDefaults(defineProps<Props>(), {
	height: 400,
})

const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const maxValue = computed(() => Math.max(...props.data.map((d) => d.value)))

const chartData = computed(() => {
	return props.data.map((item, index) => ({
		...item,
		color: item.color || defaultColors[index % defaultColors.length],
		percentage: (item.value / maxValue.value) * 100,
		index,
	}))
})
</script>

<template>
  <div class="flex flex-col gap-1" :style="{ height: `${height}px` }">
    <div
      v-for="item in chartData"
      :key="item.label"
      class="relative flex-1 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
    >
      <div
        class="h-full flex items-center justify-center rounded transition-all"
        :style="{
          width: `${item.percentage}%`,
          backgroundColor: item.color,
        }"
      >
        <div class="text-white font-medium text-sm px-4 text-center">
          <div>{{ item.label }}</div>
          <div class="text-xs opacity-90">{{ item.value }} ({{ item.percentage.toFixed(1) }}%)</div>
        </div>
      </div>
    </div>
  </div>
</template>
