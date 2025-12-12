<template>
	<aside class="w-72 p-6 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700/50">
		<p class="font-bold mb-4 text-lg">Navigation</p>
		<DocsList v-if="navigation" :navigation="navigation" />
	</aside>
</template>

<script setup lang="ts">
import { useDocsNavigation } from "~/composables/useDocs";

const { data: navigation } = useDocsNavigation();
</script>
