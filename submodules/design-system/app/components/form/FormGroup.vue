<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium">{{ label }}</label>
    <slot />
    <p v-if="helpText" class="text-xs text-gray-500">{{ helpText }}</p>
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: { type: String, default: '' },
  helpText: { type: String, default: '' },
  error: { type: String, default: '' }
})
</script>
