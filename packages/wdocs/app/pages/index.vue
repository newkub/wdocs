<script setup lang="ts">
import { useDocsNavigation } from "~/composables/docs";

const { data: navigation } = useDocsNavigation();
</script>

<template>
	<div class="prose dark:prose-invert max-w-none">
		<h1>Welcome to Wrikka Learn</h1>
		<p>
			Your journey to mastering Wrikka starts here. Explore our guides and API
			references to get started.
		</p>

		<h2 class="text-2xl font-bold mt-8 mb-4">Available Documents</h2>
		<DocsList v-if="navigation" :navigation="navigation" />
	</div>
</template>

<style scoped>
/* Using prose class from Tailwind Typography, so custom styles are minimal */
</style>
