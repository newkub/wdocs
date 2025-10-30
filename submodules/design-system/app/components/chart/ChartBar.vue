<script setup lang="ts">
interface DataPoint {
	name: string
	value: number
	color?: string
}

interface Props {
	data: DataPoint[]
	height?: number
	defaultColor?: string
	horizontal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	height: 320,
	defaultColor: '#3b82f6',
	horizontal: false,
})

const maxValue = computed(() => Math.max(...props.data.map((d) => d.value)))

const chartData = computed(() => {
	return props.data.map((item) => ({
		...item,
		color: item.color || props.defaultColor,
		percentage: (item.value / maxValue.value) * 100,
	}))
})
</script>

<template>
  <div class="relative" :style="{ height: `${height}px` }">
    <div v-if="!horizontal" class="h-full flex items-end justify-between gap-2">
      <div
        v-for="item in chartData"
        :key="item.name"
        class="flex-1 flex flex-col items-center gap-2"
      >
        <div class="relative w-full flex-1 flex items-end">
          <div
            class="w-full rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
            :style="{
              height: `${item.percentage}%`,
              backgroundColor: item.color,
            }"
            :title="`${item.name}: ${item.value}`"
          />
        </div>
        <span class="text-xs text-gray-600">{{ item.name }}</span>
      </div>
    </div>

    <div v-else class="h-full flex flex-col justify-between gap-2">
      <div
        v-for="item in chartData"
        :key="item.name"
        class="flex items-center gap-3"
      >
        <span class="text-xs text-gray-600 w-20 text-right">{{ item.name }}</span>
        <div class="flex-1 relative h-8">
          <div
            class="h-full rounded transition-all duration-500 hover:opacity-80 cursor-pointer"
            :style="{
              width: `${item.percentage}%`,
              backgroundColor: item.color,
            }"
            :title="`${item.name}: ${item.value}`"
          />
        </div>
        <span class="text-xs font-medium w-12">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>
