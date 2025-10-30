<script setup lang="ts">
import { computed } from "vue";

interface Props {
	to: string;
	variant?: "default" | "ghost" | "primary";
	size?: "default" | "sm" | "lg";
	external?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	external: false,
	size: "default",
	variant: "default",
});

const linkClasses = computed(() => {
	const baseClasses =
		"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

	const variantClasses = {
		default: "text-foreground hover:text-primary",
		ghost: "hover:bg-accent hover:text-accent-foreground",
		primary: "text-primary hover:text-primary/80",
	};

	const sizeClasses = {
		default: "h-10 py-2 px-4",
		lg: "h-11 px-8 rounded-md",
		sm: "h-9 px-3 rounded-md",
	};

	return [baseClasses, variantClasses[props.variant], sizeClasses[props.size]];
});
</script>

<template>
  <a
    v-if="external"
    :href="to"
    target="_blank"
    rel="noopener noreferrer"
    :class="[$attrs.class, linkClasses]"
  >
    <slot />
  </a>
  <NuxtLink
    v-else
    :to="to"
    :class="[$attrs.class, linkClasses]"
  >
    <slot />
  </NuxtLink>
</template>
