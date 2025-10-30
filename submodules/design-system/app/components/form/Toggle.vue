<script setup lang="ts">
interface ToggleOption {
	value: string;
	icon: string;
	label: string;
}

interface Props {
	modelValue: string;
	options: ToggleOption[];
	size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
	size: "md",
});

const emit = defineEmits(["update:modelValue"]);

const currentOption = computed(() => {
	return (
		props.options.find((option) => option.value === props.modelValue) ??
		props.options[0]
	);
});

function toggle() {
	const currentValue = props.modelValue;
	const currentIndex = props.options.findIndex(
		(option) => option.value === currentValue,
	);
	const nextIndex = (currentIndex + 1) % props.options.length;
	const nextOption = props.options[nextIndex];
	if (nextOption) {
		emit("update:modelValue", nextOption.value);
	}
}

const sizeClasses = computed(() => {
	switch (props.size) {
		case "sm":
			return "w-4 h-4";
		case "lg":
			return "w-6 h-6";
		default:
			return "w-5 h-5";
	}
});

// Ensure currentOption is never undefined for template usage
const safeCurrentOption = computed(() => {
	return currentOption.value ?? props.options[0];
});
</script>

<template>
  <button
    @click="toggle"
    class="p-2 rounded-full hover:bg-gray-200 transition-colors"
    :aria-label="`Switch to ${safeCurrentOption.label}`"
    :title="`Current: ${safeCurrentOption.label}`"
  >
    <div :class="[safeCurrentOption.icon, sizeClasses]" />
  </button>
</template>
