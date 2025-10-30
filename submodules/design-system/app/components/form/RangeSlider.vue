<template>
  <div class="space-y-4">
    <div class="flex justify-between">
      <span>{{ minValue }}</span>
      <span>{{ maxValue }}</span>
    </div>
    <input 
      type="range" 
      v-model="minValue"
      :min="min" 
      :max="max"
      class="w-full"
    />
    <input 
      type="range" 
      v-model="maxValue"
      :min="min" 
      :max="max"
      class="w-full"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  modelValue: { type: Array as () => number[], default: () => [0, 100] }
})

const emit = defineEmits(['update:modelValue'])

const minValue = computed({
  get: () => props.modelValue[0],
  set: (value) => emit('update:modelValue', [value, props.modelValue[1]])
})

const maxValue = computed({
  get: () => props.modelValue[1],
  set: (value) => emit('update:modelValue', [props.modelValue[0], value])
})
</script>
