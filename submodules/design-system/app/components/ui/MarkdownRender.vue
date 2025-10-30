<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Codeblock from "~/components/code/Codeblock.vue";
import Table from "~/components/ui/Table.vue";
import {
	type ParsedElement,
	useMarkdownRender,
} from "~/composables/useMarkdownRender";

const props = defineProps<{
	source: string;
}>();

const { parseMarkdownClient, renderToHtml, isInitialized } =
	useMarkdownRender();

const parsedContent = computed(() => {
	if (process.server || !isInitialized.value) {
		// On server, or before client is initialized, just render the raw HTML
		// This avoids calling the client-side parsing logic during SSR
		return [
			{ content: renderToHtml(props.source), type: "text" } as ParsedElement,
		];
	}
	// On client, once initialized, parse into components
	return parseMarkdownClient(props.source);
});
</script>

<template>
  <div class="prose prose-lg max-w-none prose-headings:font-semibold prose-a:text-primary hover:prose-a:underline prose-code:font-mono prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-1 prose-code:rounded markdown-content">
    <template v-for="(element, index) in parsedContent" :key="index">
      <div 
        v-if="element.type === 'text'" 
        v-html="element.content"
        class="markdown-text"
      />
      <div 
        v-else-if="element.type === 'code'"
        class="my-8"
      >
        <Codeblock
          :code="(element as ParsedElement & { language?: string }).content || ''"
          :language="(element as ParsedElement & { language?: string }).language || 'plaintext'"
        />
      </div>
      <div 
        v-else-if="element.type === 'table'"
        class="my-10 overflow-x-auto"
      >
        <Table
          :headers="(element as ParsedElement & { headers?: string[] }).headers || []"
          :rows="(element as ParsedElement & { rows?: string[][] }).rows || []"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.markdown-content :deep(h1) {
  @apply text-4xl font-bold mt-12 mb-6 leading-tight;
}

.markdown-content :deep(h2) {
  @apply text-3xl font-bold mt-10 mb-5 leading-tight;
}

.markdown-content :deep(h3) {
  @apply text-2xl font-semibold mt-8 mb-4 leading-snug;
}

.markdown-content :deep(h4) {
  @apply text-xl font-semibold mt-6 mb-3 leading-snug;
}

.markdown-content :deep(h5) {
  @apply text-lg font-semibold mt-5 mb-2.5 leading-normal;
}

.markdown-content :deep(h6) {
  @apply text-base font-semibold mt-4 mb-2 leading-normal;
}

.markdown-content :deep(p) {
  @apply mb-5 leading-relaxed;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  @apply my-6 pl-6 space-y-2;
}

.markdown-content :deep(li) {
  @apply leading-relaxed;
}

.markdown-content :deep(li > ul),
.markdown-content :deep(li > ol) {
  @apply my-2;
}

.markdown-content :deep(blockquote) {
  @apply my-6 pl-4 border-l-4 border-gray-300 italic text-gray-700;
}

.markdown-content :deep(hr) {
  @apply my-8 border-gray-300;
}

.markdown-content :deep(a) {
  @apply text-blue-600 hover:underline;
}

.markdown-content :deep(code:not(pre code)) {
  @apply px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono;
}

.markdown-content :deep(pre) {
  @apply my-6 p-4 rounded-lg overflow-x-auto;
}

.markdown-content :deep(img) {
  @apply my-6 rounded-lg max-w-full h-auto;
}

.markdown-content :deep(table) {
  @apply my-8 w-full border-collapse text-left;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  @apply px-5 py-3 border-b border-gray-200;
}

.markdown-content :deep(th) {
  @apply bg-gray-50 font-semibold text-sm uppercase tracking-wider;
}

.markdown-content :deep(tr:last-child td) {
  @apply border-b-0;
}

/* ลด spacing สำหรับ heading ที่อยู่ตัวแรก */
.markdown-content :deep(h1:first-child),
.markdown-content :deep(h2:first-child),
.markdown-content :deep(h3:first-child),
.markdown-content :deep(h4:first-child),
.markdown-content :deep(h5:first-child),
.markdown-content :deep(h6:first-child) {
  @apply mt-0;
}
</style>