<template>
	<div class="my-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
		<div class="flex items-center gap-4">
			<span
				:class="_methodClass"
				class="px-3 py-1 rounded-md text-sm font-semibold text-white"
			>{{ method.toUpperCase() }}</span>
			<span class="text-lg font-mono font-semibold">{{ path }}</span>
		</div>
		<p v-if="description" class="mt-2 text-gray-600 dark:text-gray-300">
			{{ description }}
		</p>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
	method: string;
	path: string;
	description?: string;
}>();

const _methodClass = computed(() => {
	switch (props.method.toUpperCase()) {
		case "GET":
			return "bg-green-500";
		case "POST":
			return "bg-blue-500";
		case "PUT":
			return "bg-yellow-500";
		case "DELETE":
			return "bg-red-500";
		default:
			return "bg-gray-500";
	}
});
</script>
