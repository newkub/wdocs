<script setup lang="ts">
interface Props {
	value: number
	max?: number
	min?: number
	label?: string
	color?: string
	showValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	max: 100,
	min: 0,
	label: '',
	color: '#3b82f6',
	showValue: true,
})

const percentage = computed(() => {
	const range = props.max - props.min
	return ((props.value - props.min) / range) * 100
})

const angle = computed(() => {
	return (percentage.value / 100) * 180 - 90
})

const needleTransform = computed(() => {
	return `rotate(${angle.value} 100 100)`
})

const getColor = computed(() => {
	if (percentage.value < 33) return '#ef4444'
	if (percentage.value < 66) return '#f59e0b'
	return '#10b981'
})
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <svg width="200" height="120" viewBox="0 0 200 120">
      <!-- Background arc -->
      <path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke="#e5e7eb"
        stroke-width="20"
        stroke-linecap="round"
      />

      <!-- Colored segments -->
      <path
        d="M 20 100 A 80 80 0 0 1 60 35"
        fill="none"
        stroke="#ef4444"
        stroke-width="20"
        stroke-linecap="round"
        opacity="0.3"
      />
      <path
        d="M 60 35 A 80 80 0 0 1 140 35"
        fill="none"
        stroke="#f59e0b"
        stroke-width="20"
        stroke-linecap="round"
        opacity="0.3"
      />
      <path
        d="M 140 35 A 80 80 0 0 1 180 100"
        fill="none"
        stroke="#10b981"
        stroke-width="20"
        stroke-linecap="round"
        opacity="0.3"
      />

      <!-- Progress arc -->
      <path
        :d="`M 20 100 A 80 80 0 ${percentage > 50 ? 1 : 0} 1 ${
          100 + 80 * Math.cos((angle + 90) * Math.PI / 180)
        } ${
          100 + 80 * Math.sin((angle + 90) * Math.PI / 180)
        }`"
        fill="none"
        :stroke="getColor"
        stroke-width="20"
        stroke-linecap="round"
      />

      <!-- Center dot -->
      <circle cx="100" cy="100" r="8" fill="#374151" />

      <!-- Needle -->
      <line
        x1="100"
        y1="100"
        x2="100"
        y2="30"
        stroke="#374151"
        stroke-width="3"
        stroke-linecap="round"
        :transform="needleTransform"
      />
    </svg>

    <!-- Value display -->
    <div class="text-center">
      <div v-if="showValue" class="text-3xl font-bold" :style="{ color: getColor }">
        {{ value }}
      </div>
      <div v-if="label" class="text-sm text-gray-600 mt-1">
        {{ label }}
      </div>
      <div class="text-xs text-gray-500 mt-1">
        {{ min }} - {{ max }}
      </div>
    </div>
  </div>
</template>
