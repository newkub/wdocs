<template>
  <div class="border-2 border-dashed rounded-md p-4 text-center">
    <input 
      type="file" 
      ref="fileInput"
      class="hidden" 
      @change="handleFileChange"
    />
    <button 
      type="button" 
      @click="$refs.fileInput.click()"
      class="px-4 py-2 bg-gray-100 rounded-md"
    >
      Choose File
    </button>
    <p v-if="file" class="mt-2">{{ file.name }}</p>
  </div>
</template>

<script setup lang="ts">
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
  }
}

const clearFile = () => {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  file.value = null
}

defineExpose({ clearFile })
</script>
