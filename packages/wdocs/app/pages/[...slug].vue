<script setup lang="ts">
import type { Doc } from "~/app/types/docs";

const route = useRoute();

const slug = route.params.slug;
const path = Array.isArray(slug) ? slug.join("/") : slug;

const { data: doc } = path
	? await useAsyncData<Doc>(
		`doc-${path}`,
		() => $fetch<Doc>(`/api/docs/${path}`),
	)
	: { data: ref(null) };
</script>

<template>
	<div v-if="doc" class="prose dark:prose-invert max-w-none">
		<h1>{{ doc.title }}</h1>
		<p>{{ doc.content }}</p>
	</div>
	<div v-else>
		<p>Document not found.</p>
	</div>
</template>
