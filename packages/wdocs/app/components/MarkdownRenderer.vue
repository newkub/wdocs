<script setup lang="ts">
import type { Heading } from "../../shared/types";
import { useMarkdownParser } from "../composables/useMarkdownParser";

const props = defineProps<{ content: string }>();
const emit = defineEmits<(e: "headings", payload: Heading[]) => void>();

const contentRef = toRef(props, "content");
const { renderedMarkdown: _renderedMarkdown, headings: _headings } =
	useMarkdownParser(contentRef);

watch(_headings, (newHeadings) => {
	emit("headings", newHeadings);
});
</script>

<template>
	<div class="prose dark:prose-invert max-w-none" v-html="_renderedMarkdown">
	</div>
</template>
