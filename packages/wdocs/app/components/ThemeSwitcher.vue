<script setup lang="ts">
const colorMode = useColorMode();

const toggleMode = () => {
	colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
	<button
		@click="toggleMode"
		class="px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
	>
		<ColorScheme placeholder="..." tag="span">
			<Icon
				v-if="colorMode.value === 'dark'"
				name="mdi:weather-night"
				class="w-6 h-6"
			/>
			<Icon v-else name="mdi:white-balance-sunny" class="w-6 h-6" />
		</ColorScheme>
	</button>
</template>
