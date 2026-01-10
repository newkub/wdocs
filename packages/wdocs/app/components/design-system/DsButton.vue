<template>
	<button :class="_buttonClasses">
		<slot>Button</slot>
	</button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		variant?: "primary" | "secondary" | "ghost";
		size?: "sm" | "md" | "lg";
	}>(),
	{
		variant: "primary",
		size: "md",
	},
);

const _buttonClasses = computed(() => {
	const base =
		"font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900";

	const sizes = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg",
	};

	const variants = {
		primary:
			"bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500",
		secondary:
			"bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
		ghost:
			"bg-transparent text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 focus:ring-primary-500",
	};

	return [base, sizes[props.size], variants[props.variant]];
});
</script>
