<script setup lang="ts">
import { ref, computed } from 'vue'
import { ofetch } from 'ofetch'

interface Parameter {
  name: string
  in: 'query' | 'header' | 'path' | 'cookie'
  // Add other properties as needed
}

interface ApiResponse {
  status: number
  data: unknown
}

const props = defineProps<{
  method: string
  path: string
  parameters?: Parameter[]
}>()

const baseUrl = ref('https://api.example.com') // This should be configurable
const authToken = ref('')
const response = ref<ApiResponse | null>(null)
const loading = ref(false)

const formValues = ref<Record<string, string>>({})

const _curlCommand = computed(() => {
  let command = `curl -X ${props.method} '${baseUrl.value}${props.path}'`
  if (authToken.value) {
    command += ` \
    -H 'Authorization: Bearer ${authToken.value}'`
  }
  return command
})

async function _testRequest() {
  loading.value = true
  response.value = null
  try {
    const res = await ofetch(`${baseUrl.value}${props.path}`, {
            method: props.method as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      headers: authToken.value ? { Authorization: `Bearer ${authToken.value}` } : {},
      params: props.parameters?.filter(p => p.in === 'query').reduce((acc, p) => {
        const value = formValues.value[p.name]
        if (value !== undefined) {
          acc[p.name] = value
        }
        return acc
      }, {} as Record<string, string>),
    })
    response.value = { status: 200, data: res }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && 'data' in error.response) {
      const errResponse = error.response as { status: number, data: unknown }
      response.value = { status: errResponse.status || 500, data: errResponse.data }
    } else {
      response.value = { status: 500, data: 'An unexpected error occurred' }
    }
  }
  loading.value = false
}
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
    <pre class="bg-gray-900 text-white p-4 rounded-md text-sm overflow-x-auto"><code>{{ _curlCommand }}</code></pre>
    
    <div class="mt-4 space-y-4">
      <div>
        <label for="baseUrl" class="block text-sm font-medium">Base URL</label>
        <input type="text" id="baseUrl" v-model="baseUrl" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
      </div>
      <div>
        <label for="authToken" class="block text-sm font-medium">Auth Token (Bearer)</label>
        <input type="text" id="authToken" v-model="authToken" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
      </div>
      <div v-for="param in parameters?.filter(p => p.in === 'query')" :key="param.name">
        <label :for="`param-${param.name}`" class="block text-sm font-medium">{{ param.name }}</label>
        <input type="text" :id="`param-${param.name}`" v-model="formValues[param.name]" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
      </div>
    </div>

    <button @click="_testRequest" :disabled="loading" class="mt-4 w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 disabled:bg-gray-400">
      {{ loading ? 'Testing...' : 'Test Request' }}
    </button>

    <div v-if="response" class="mt-4">
      <h4 class="font-semibold">Response</h4>
      <div class="mt-2 p-4 rounded-md text-sm" :class="[response.status >= 400 ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50']">
        <p class="font-semibold">Status: {{ response.status }}</p>
        <pre class="overflow-x-auto"><code>{{ JSON.stringify(response.data, null, 2) }}</code></pre>
      </div>
    </div>
  </div>
</template>
