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
	innerRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
	size: 200,
	showLabels: true,
	innerRadius: 40,
})

const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const total = computed(() => props.data.reduce((sum, item) => sum + item.value, 0))

const slices = computed(() => {
	let currentAngle = 0
	const outerRadius = 80
	const innerRadius = props.innerRadius
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

		const x1Outer = centerX + outerRadius * Math.cos(startAngleRad)
		const y1Outer = centerY + outerRadius * Math.sin(startAngleRad)
		const x2Outer = centerX + outerRadius * Math.cos(endAngleRad)
		const y2Outer = centerY + outerRadius * Math.sin(endAngleRad)

		const x1Inner = centerX + innerRadius * Math.cos(startAngleRad)
		const y1Inner = centerY + innerRadius * Math.sin(startAngleRad)
		const x2Inner = centerX + innerRadius * Math.cos(endAngleRad)
		const y2Inner = centerY + innerRadius * Math.sin(endAngleRad)

		const largeArcFlag = angle > 180 ? 1 : 0

		const pathData = [
			`M ${x1Outer} ${y1Outer}`,
			`A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
			`L ${x2Inner} ${y2Inner}`,
			`A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}`,
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
    <!-- Donut Chart -->
    <div class="relative">
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
      
      <!-- Center text -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <div class="text-2xl font-bold">{{ total }}</div>
        <div class="text-sm text-gray-500">Total</div>
      </div>
    </div>

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
