<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useMarkdownRender } from "~/composables/useMarkdownRender"; // Directly use the composable

const props = defineProps({
	code: {
		default: "",
		type: String,
	},
	language: {
		default: "plaintext",
		type: String,
	},
});

const highlightedHtml = ref("");
const { renderToHtml, isInitialized } = useMarkdownRender();

watch(
	() => [props.code, props.language, isInitialized.value],
	() => {
		if (props.code && isInitialized.value) {
			const markdown = `\`\`\`${props.language}\n${props.code}\n\`\`\``;
			highlightedHtml.value = renderToHtml(markdown);
		} else {
			highlightedHtml.value = "";
		}
	},
	{ immediate: true },
);
</script>

<template>
  <div v-if="highlightedHtml" v-html="highlightedHtml" class="prose max-w-none"></div>
  <div v-else class="p-4 text-gray-500">No file selected or file is empty.</div>
</template>
