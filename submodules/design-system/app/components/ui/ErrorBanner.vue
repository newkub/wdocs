<script setup lang="ts">
import type { SheetError } from "~/types/sheet";

interface Props {
	error: SheetError | null;
	onDismiss?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
	error: null,
	onDismiss: () => {},
});
</script>

<template>
  <div
    v-if="error"
    class="bg-red-50 border-l-4 border-red-400 p-4"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <div class="i-mdi-alert-circle text-red-400" />
      </div>
      <div class="ml-3">
        <p class="text-sm text-red-700">
          <strong>Error:</strong> {{ error.message }}
        </p>
      </div>
      <div class="ml-auto pl-3">
        <button
          @click="onDismiss"
          class="inline-flex text-red-400 hover:text-red-600"
        >
          <div class="i-mdi-close" />
        </button>
      </div>
    </div>
  </div>
</template>
