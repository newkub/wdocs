<script setup lang="ts">
import type { ApiParameter } from '~/shared/types'

const _baseUrl = defineModel<string>('baseUrl')
const _authToken = defineModel<string>('authToken')
const _formValues = defineModel<Record<string, string>>('formValues')

defineProps<{ parameters?: ApiParameter[] }>()
</script>

<template>
  <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label for="baseUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Base URL</label>
      <input type="text" id="baseUrl" v-model="_baseUrl" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
    </div>
    <div>
      <label for="authToken" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Auth Token (Bearer)</label>
      <input type="text" id="authToken" v-model="_authToken" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
    </div>
  </div>

  <div v-if="parameters?.length" class="mt-6">
    <h4 class="font-semibold mb-2">Parameters</h4>
    <div class="space-y-4">
      <div v-for="param in parameters" :key="param.name">
        <label :for="`param-${param.name}`" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ param.name }} <span class="text-xs text-gray-500">({{ param.in }})</span></label>
        <input v-if="_formValues" type="text" :id="`param-${param.name}`" v-model="_formValues[param.name]" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
      </div>
    </div>
  </div>
</template>
