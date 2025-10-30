<script setup lang="ts">
interface DataPoint {
	name: string
	value: number
}

interface Props {
	data: DataPoint[]
	color?: string
	height?: number
	fillOpacity?: number
}

const props = withDefaults(defineProps<Props>(), {
	color: '#3b82f6',
	height: 320,
	fillOpacity: 0.3,
})

const chartData = computed(() => {
	if (!props.data.length) return []

	const maxValue = Math.max(...props.data.map((d) => d.value))

	return props.data.map((item, index) => {
		const x = (index / (props.data.length - 1)) * 100
		const y = ((maxValue - item.value) / maxValue) * 100

		return {
			...item,
			x,
			y,
		}
	})
})

const areaPath = computed(() => {
	if (!chartData.value.length) return ''

	const points = chartData.value.map((d) => `${d.x},${d.y}`).join(' ')
	const firstPoint = chartData.value[0]
	const lastPoint = chartData.value[chartData.value.length - 1]

	return `0,100 ${points} ${lastPoint.x},100`
})

const linePath = computed(() => {
	return chartData.value.map((d) => `${d.x},${d.y}`).join(' ')
})
</script>

<template>
  <div class="relative" :style="{ height: `${height}px` }">
    <!-- Chart Area -->
    <div class="absolute inset-0">
      <!-- Grid lines -->
      <div class="absolute inset-0 flex flex-col justify-between">
        <div v-for="i in 5" :key="i" class="border-t border-gray-200" />
      </div>

      <!-- Chart -->
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <!-- Area fill -->
        <polygon
          :points="areaPath"
          :fill="color"
          :fill-opacity="fillOpacity"
        />

        <!-- Line -->
        <polyline
          :points="linePath"
          fill="none"
          :stroke="color"
          stroke-width="0.5"
          class="drop-shadow-sm"
        />

        <!-- Data points -->
        <g v-for="point in chartData" :key="point.name">
          <circle
            :cx="point.x"
            :cy="point.y"
            r="0.8"
            :fill="color"
            class="hover:r-1.5 transition-all cursor-pointer"
          />
        </g>
      </svg>
    </div>

    <!-- X-axis labels -->
    <div class="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 -mb-6">
      <span v-for="point in chartData" :key="point.name" class="text-center" style="width: 20px;">
        {{ point.name }}
      </span>
    </div>
  </div>
</template>
