import { useState } from "#app";

export interface PageData {
	slug: string;
	html: string;
	frontmatter: Record<string, unknown>;
	toc: Array<{ title: string; slug: string; depth: number; level: number }>;
}

export interface ContentItem {
	title: string;
	slug: string;
	path: string;
	children?: ContentItem[];
	name?: string;
}

export function useContent() {
	const content = useState<Map<string, PageData>>("content", () => new Map());
	const isLoading = useState("content:loading", () => false);

	async function getContentBySlug(slug: string): Promise<PageData | null> {
		const cacheKey = `content:${slug}`;

		if (content.value.has(cacheKey)) {
			return content.value.get(cacheKey)!;
		}

		isLoading.value = true;

		try {
			const response = await $fetch<PageData>(`/api/content/${slug}`);
			if (response) {
				content.value.set(cacheKey, response);
			}
			return response;
		} catch (error) {
			console.error(`Failed to load content for slug: ${slug}`, error);
			return null;
		} finally {
			isLoading.value = false;
		}
	}

	async function getAllContent(): Promise<ContentItem[]> {
		try {
			return await $fetch<ContentItem[]>("/api/content");
		} catch (error) {
			console.error("Failed to load all content", error);
			return [];
		}
	}

	async function searchContent(query: string): Promise<ContentItem[]> {
		try {
			return await $fetch<ContentItem[]>("/api/content/search", {
				query: { q: query },
			});
		} catch (error) {
			console.error("Failed to search content", error);
			return [];
		}
	}

	function clearCache(): void {
		content.value.clear();
	}

	return {
		content,
		isLoading,
		getContentBySlug,
		getAllContent,
		searchContent,
		clearCache,
	};
}
