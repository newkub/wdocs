<script setup lang="ts">
const { toggleTheme: _toggleTheme, currentIcon: _currentIcon } = useThemes();
</script>

<template>
	<button
		@click="_toggleTheme"
		class="flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
	>
		<Transition name="fade" mode="out-in">
			<Icon :key="_currentIcon" :name="_currentIcon" class="w-5 h-5" />
		</Transition>
	</button>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
