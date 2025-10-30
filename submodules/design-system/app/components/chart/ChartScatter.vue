<script setup lang="ts">
interface DataPoint {
	x: number
	y: number
	label?: string
	color?: string
	size?: number
}

interface Props {
	data: DataPoint[]
	height?: number
	defaultColor?: string
	xLabel?: string
	yLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
	height: 320,
	defaultColor: '#3b82f6',
	xLabel: 'X Axis',
	yLabel: 'Y Axis',
})

const maxX = computed(() => Math.max(...props.data.map((d) => d.x)))
const maxY = computed(() => Math.max(...props.data.map((d) => d.y)))

const chartData = computed(() => {
	return props.data.map((item) => ({
		...item,
		color: item.color || props.defaultColor,
		size: item.size || 5,
		xPos: (item.x / maxX.value) * 95 + 2.5,
		yPos: 100 - (item.y / maxY.value) * 95,
	}))
})
</script>

<template>
  <div class="relative" :style="{ height: `${height}px` }">
    <!-- Chart Area -->
    <div class="absolute inset-0">
      <!-- Grid -->
      <div class="absolute inset-0 flex flex-col justify-between">
        <div v-for="i in 5" :key="i" class="border-t border-gray-200" />
      </div>

      <!-- Y-axis label -->
      <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 rotate-[-90deg] text-xs text-gray-600">
        {{ yLabel }}
      </div>

      <!-- Chart -->
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <!-- Data points -->
        <g v-for="(point, index) in chartData" :key="index" preserveAspectRatio="xMidYMid">
          <circle
            :cx="point.xPos"
            :cy="point.yPos"
            :r="point.size / 10"
            :fill="point.color"
            fill-opacity="0.6"
            class="hover:fill-opacity-100 cursor-pointer transition-all"
          >
            <title>{{ point.label || `(${point.x}, ${point.y})` }}</title>
          </circle>
        </g>
      </svg>
    </div>

    <!-- X-axis label -->
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-8 text-xs text-gray-600">
      {{ xLabel }}
    </div>
  </div>
</template>
