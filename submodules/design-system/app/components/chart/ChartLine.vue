<script setup lang="ts">
interface DataPoint {
	name: string
	value: number
}

interface Props {
	data: DataPoint[]
	color?: string
	height?: number
	showDots?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	color: '#3b82f6',
	height: 320,
	showDots: true,
})

const chartData = computed(() => {
	if (!props.data.length) return []

	const maxValue = Math.max(...props.data.map((d) => d.value))
	const minValue = Math.min(...props.data.map((d) => d.value))
	const range = maxValue - minValue || 1

	return props.data.map((item, index) => {
		const x = (index / (props.data.length - 1)) * 100
		const y = 100 - ((item.value - minValue) / range) * 100

		return {
			...item,
			x,
			y,
		}
	})
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
        <!-- Line -->
        <polyline
          :points="linePath"
          fill="none"
          :stroke="color"
          stroke-width="0.5"
          class="drop-shadow-sm"
        />

        <!-- Data points -->
        <g v-if="showDots" v-for="point in chartData" :key="point.name">
          <circle
            :cx="point.x"
            :cy="point.y"
            r="0.8"
            :fill="color"
            class="hover:r-1.5 transition-all cursor-pointer"
          >
            <title>{{ point.name }}: {{ point.value }}</title>
          </circle>
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
