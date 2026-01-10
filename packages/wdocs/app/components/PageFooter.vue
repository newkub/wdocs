<script setup lang="ts">
import { usePageLifecycle } from "~/composables/usePageLifecycle";
import type { PageData, WDocsConfig } from "~/shared/types";

const { wdocs: _wdocs } = useAppConfig() as { wdocs: WDocsConfig };

const props = defineProps<{
	page: PageData | null;
}>();

const { editPageUrl: _editPageUrl, lastUpdated: _lastUpdated } =
	usePageLifecycle(toRef(props, "page"));
</script>

<template>
	<div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-sm">
		<div class="flex justify-between">
			<a
				v-if="_editPageUrl"
				:href="_editPageUrl"
				target="_blank"
				rel="noopener noreferrer"
				class="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
			>
				{{ _wdocs.editPage?.text ?? "Edit this page on GitHub" }}
			</a>
			<span v-if="_lastUpdated" class="text-gray-500 dark:text-gray-400">
				Last updated on {{ _lastUpdated }}
			</span>
		</div>
	</div>
</template>
