<script setup lang="ts">
interface DataPoint {
	label: string
	value: number
}

interface Props {
	data: DataPoint[]
	size?: number
	color?: string
	maxValue?: number
}

const props = withDefaults(defineProps<Props>(), {
	size: 300,
	color: '#3b82f6',
	maxValue: 100,
})

const points = computed(() => {
	const centerX = 150
	const centerY = 150
	const radius = 100
	const angleStep = (Math.PI * 2) / props.data.length

	return props.data.map((item, index) => {
		const angle = angleStep * index - Math.PI / 2
		const distance = (item.value / props.maxValue) * radius
		const x = centerX + distance * Math.cos(angle)
		const y = centerY + distance * Math.sin(angle)

		return {
			...item,
			x,
			y,
			angle,
			labelX: centerX + (radius + 20) * Math.cos(angle),
			labelY: centerY + (radius + 20) * Math.sin(angle),
		}
	})
})

const polygonPoints = computed(() => {
	return points.value.map(p => `${p.x},${p.y}`).join(' ')
})

const gridLevels = [0.2, 0.4, 0.6, 0.8, 1]
</script>

<template>
  <div class="flex items-center justify-center">
    <svg :width="size" :height="size" viewBox="0 0 300 300">
      <!-- Grid levels -->
      <g v-for="level in gridLevels" :key="level" class="stroke-gray-300">
        <polygon
          :points="data.map((_, index) => {
            const centerX = 150
            const centerY = 150
            const radius = 100 * level
            const angleStep = (Math.PI * 2) / data.length
            const angle = angleStep * index - Math.PI / 2
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)
            return `${x},${y}`
          }).join(' ')"
          fill="none"
          stroke-width="1"
          opacity="0.3"
        />
      </g>

      <!-- Axis lines -->
      <g v-for="point in points" :key="point.label" class="stroke-gray-300">
        <line
          x1="150"
          y1="150"
          :x2="point.labelX"
          :y2="point.labelY"
          stroke-width="1"
          opacity="0.3"
        />
      </g>

      <!-- Data polygon -->
      <polygon
        :points="polygonPoints"
        :fill="color"
        fill-opacity="0.3"
        :stroke="color"
        stroke-width="2"
      />

      <!-- Data points -->
      <g v-for="point in points" :key="point.label">
        <circle
          :cx="point.x"
          :cy="point.y"
          r="4"
          :fill="color"
          class="cursor-pointer hover:r-6 transition-all"
        >
          <title>{{ point.label }}: {{ point.value }}</title>
        </circle>
      </g>

      <!-- Labels -->
      <g v-for="point in points" :key="point.label">
        <text
          :x="point.labelX"
          :y="point.labelY"
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-xs fill-gray-700 font-medium"
        >
          {{ point.label }}
        </text>
      </g>
    </svg>
  </div>
</template>
