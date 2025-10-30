<script setup lang="ts">
import { computed } from "vue";

interface Props {
	variant?: "default" | "destructive";
}

const props = withDefaults(defineProps<Props>(), {
	variant: "default",
});

const alertClasses = computed(() => {
	const baseClasses =
		"relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4";

	const variantClasses = {
		default: "bg-background text-foreground",
		destructive:
			"border-destructive/50 text-destructive [&>svg]:text-destructive",
	};

	return [baseClasses, variantClasses[props.variant]];
});
</script>

<template>
  <div role="alert" :class="alertClasses">
    <slot />
  </div>
</template>
