<script setup lang="ts">
import { provide, ref, watch } from "vue";

interface Props {
	type?: "single" | "multiple";
	collapsible?: boolean;
	defaultValue?: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
	collapsible: false,
	type: "single",
});

const activeValue = ref<string | string[] | null>(
	props.defaultValue ?? (props.type === "multiple" ? [] : null),
);

function toggleItem(id: string) {
	if (props.type === "multiple") {
		const currentValues = (activeValue.value as string[]) || [];
		if (currentValues.includes(id)) {
			activeValue.value = currentValues.filter((v) => v !== id);
		} else {
			activeValue.value = [...currentValues, id];
		}
	} else {
		if (props.collapsible && activeValue.value === id) {
			activeValue.value = null;
		} else {
			activeValue.value = id;
		}
	}
}

provide("accordion-state", {
	activeValue,
	toggleItem,
	type: props.type,
});

watch(
	() => props.type,
	(newType) => {
		if (
			newType === "single" &&
			Array.isArray(activeValue.value) &&
			activeValue.value.length > 1
		) {
			activeValue.value = activeValue.value[0] ?? null;
		} else if (
			newType === "multiple" &&
			typeof activeValue.value === "string"
		) {
			activeValue.value = [activeValue.value];
		}
	},
);
</script>

<template>
  <div class="border-t">
    <slot />
  </div>
</template>
