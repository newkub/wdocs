<script setup lang="ts">
interface DataPoint {
	name: string
	value: number
	color?: string
}

interface Props {
	data: DataPoint[]
	size?: number
	showLabels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	size: 200,
	showLabels: true,
})

const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))

const slices = computed(() => {
	let currentAngle = 0
	const radius = 80
	const centerX = 100
	const centerY = 100

	return props.data.map((item, index) => {
		const percentage = (item.value / total.value) * 100
		const angle = (percentage / 100) * 360
		const startAngle = currentAngle
		const endAngle = currentAngle + angle

		currentAngle = endAngle

		const startAngleRad = ((startAngle - 90) * Math.PI) / 180
		const endAngleRad = ((endAngle - 90) * Math.PI) / 180

		const x1 = centerX + radius * Math.cos(startAngleRad)
		const y1 = centerY + radius * Math.sin(startAngleRad)
		const x2 = centerX + radius * Math.cos(endAngleRad)
		const y2 = centerY + radius * Math.sin(endAngleRad)

		const largeArcFlag = angle > 180 ? 1 : 0

		const pathData = [
			`M ${centerX} ${centerY}`,
			`L ${x1} ${y1}`,
			`A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
			'Z',
		].join(' ')

		return {
			...item,
			color: item.color || defaultColors[index % defaultColors.length],
			path: pathData,
			percentage,
		}
	})
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Pie Chart -->
    <svg :width="size" :height="size" viewBox="0 0 200 200">
      <g
        v-for="(slice, index) in slices"
        :key="slice.name"
        class="cursor-pointer hover:opacity-80 transition-opacity"
      >
        <path :d="slice.path" :fill="slice.color">
          <title>{{ slice.name }}: {{ slice.value }} ({{ slice.percentage.toFixed(1) }}%)</title>
        </path>
      </g>
    </svg>

    <!-- Legend -->
    <div v-if="showLabels" class="flex flex-wrap justify-center gap-4 text-sm">
      <div v-for="slice in slices" :key="slice.name" class="flex items-center gap-2">
        <div
          class="w-3 h-3 rounded-full"
          :style="{ backgroundColor: slice.color }"
        />
        <span class="text-gray-700">{{ slice.name }}</span>
        <span class="font-semibold">{{ slice.percentage.toFixed(1) }}%</span>
      </div>
    </div>
  </div>
</template>
