<script setup lang="ts">
import Toggle from "./Toggle.vue";

const colorMode = useColorMode();

const themeOptions = [
	{
		icon: "i-mdi-weather-sunny",
		label: "Light",
		value: "light",
	},
	{
		icon: "i-mdi-weather-night",
		label: "Dark",
		value: "dark",
	},
	{
		icon: "i-mdi-laptop",
		label: "System",
		value: "system",
	},
];
</script>

<template>
  <Toggle
    v-model="colorMode.preference"
    :options="themeOptions"
  />
</template>
