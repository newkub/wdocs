<script setup lang="ts">
import type { ApiResponse } from "~/shared/types";

defineProps<{
	responses: Record<string, ApiResponse>;
}>();

function _getStatusClass(status: string) {
	const code = Number(status);
	if (code >= 200 && code < 300) return "text-green-500";
	if (code >= 300 && code < 400) return "text-yellow-500";
	if (code >= 400 && code < 500) return "text-orange-500";
	if (code >= 500) return "text-red-500";
	return "text-gray-500";
}
</script>

<template>
	<div class="my-8">
		<h3 class="text-xl font-semibold mb-4">Responses</h3>
		<div class="space-y-4">
			<div
				v-for="(response, status) in responses"
				:key="status"
				class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
			>
				<div class="flex items-center gap-2">
					<span class="font-bold text-sm" :class="_getStatusClass(status)">{{
						status
					}}</span>
				</div>
				<p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
					{{ response.description }}
				</p>
			</div>
		</div>
	</div>
</template>
