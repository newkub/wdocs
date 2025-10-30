<script setup lang="ts">
interface DataPoint {
	x: number
	y: number
	value: number
}

interface Props {
	data: DataPoint[]
	xLabels?: string[]
	yLabels?: string[]
	colorScale?: string[]
}

const props = withDefaults(defineProps<Props>(), {
	colorScale: () => ['#dcfce7', '#86efac', '#22c55e', '#15803d', '#14532d'],
})

const maxValue = computed(() => Math.max(...props.data.map((d) => d.value)))
const minValue = computed(() => Math.min(...props.data.map((d) => d.value)))

const getColor = (value: number) => {
	const normalized = (value - minValue.value) / (maxValue.value - minValue.value || 1)
	const index = Math.floor(normalized * (props.colorScale.length - 1))
	return props.colorScale[Math.min(index, props.colorScale.length - 1)]
}

const maxX = computed(() => Math.max(...props.data.map((d) => d.x)))
const maxY = computed(() => Math.max(...props.data.map((d) => d.y)))
</script>

<template>
  <div class="inline-block">
    <!-- Heatmap -->
    <div class="flex gap-1">
      <!-- Y-axis labels -->
      <div v-if="yLabels" class="flex flex-col gap-1 justify-center text-xs text-gray-600">
        <div
          v-for="(label, index) in yLabels"
          :key="index"
          class="h-8 flex items-center justify-end pr-2"
        >
          {{ label }}
        </div>
      </div>

      <!-- Grid -->
      <div>
        <div
          v-for="y in maxY + 1"
          :key="y"
          class="flex gap-1"
        >
          <div
            v-for="x in maxX + 1"
            :key="x"
            class="w-8 h-8 rounded transition-all hover:scale-110 cursor-pointer"
            :style="{
              backgroundColor: getColor(
                data.find(d => d.x === x - 1 && d.y === y - 1)?.value || 0
              ),
            }"
            :title="data.find(d => d.x === x - 1 && d.y === y - 1)?.value.toString()"
          />
        </div>
      </div>
    </div>

    <!-- X-axis labels -->
    <div v-if="xLabels" class="flex gap-1 mt-1 text-xs text-gray-600">
      <div v-if="yLabels" class="w-auto" />
      <div
        v-for="(label, index) in xLabels"
        :key="index"
        class="w-8 text-center"
      >
        {{ label }}
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-2 mt-4 text-xs text-gray-600">
      <span>Low</span>
      <div class="flex gap-1">
        <div
          v-for="(color, index) in colorScale"
          :key="index"
          class="w-8 h-4 rounded"
          :style="{ backgroundColor: color }"
        />
      </div>
      <span>High</span>
    </div>
  </div>
</template>
