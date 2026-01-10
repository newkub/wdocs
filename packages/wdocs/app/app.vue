<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
useHead({
	bodyAttrs: {
		class:
			"antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-900",
	},
});
</script>

<style>
/* Global styles */
html, body, #__nuxt {
	height: 100%;
	width: 100%;
	margin: 0;
	padding: 0;
}

/* Custom scrollbar for a more modern look */
::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}
::-webkit-scrollbar-track {
	background: transparent;
}
::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
	background: #555;
}
.dark ::-webkit-scrollbar-thumb {
	background: #555;
}
.dark ::-webkit-scrollbar-thumb:hover {
	background: #888;
}

/* Custom Container Styles */
.custom-block.info {
	@apply bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-4
		rounded-r-lg;
}
.custom-block.tip {
	@apply bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 my-4
		rounded-r-lg;
}
.custom-block.warning {
	@apply bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4
		my-4 rounded-r-lg;
}
.custom-block-title {
	@apply font-semibold;
}
</style>
