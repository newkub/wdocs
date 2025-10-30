<template>
  <div class="relative">
    <input
      type="date"
      v-model="dateValue"
      class="w-full px-3 py-2 border rounded-md"
      :min="minDate"
      :max="maxDate"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: String, default: '' },
  minDate: { type: String, default: '' },
  maxDate: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const dateValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>
