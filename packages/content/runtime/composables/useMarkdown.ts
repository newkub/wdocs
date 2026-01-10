import { useState } from "#app";

export interface MarkdownResult {
	html: string;
	toc: Array<{ title: string; slug: string; depth: number; level: number }>;
}

export function useMarkdown() {
	const cache = useState<Map<string, MarkdownResult>>("markdown:cache", () => new Map());

	async function parseMarkdown(markdown: string): Promise<MarkdownResult> {
		const cacheKey = `md:${markdown.slice(0, 100)}`;

		if (cache.value.has(cacheKey)) {
			return cache.value.get(cacheKey)!;
		}

		try {
			const result = await $fetch<MarkdownResult>("/api/markdown/parse", {
				method: "POST",
				body: { markdown },
			});
			cache.value.set(cacheKey, result);
			return result;
		} catch (error) {
			console.error("Failed to parse markdown", error);
			return { html: markdown, toc: [] };
		}
	}

	function clearCache(): void {
		cache.value.clear();
	}

	return {
		parseMarkdown,
		clearCache,
	};
}
