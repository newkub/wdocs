import { useState } from "#app";

export interface SearchResult {
	title: string;
	slug: string;
	path: string;
	content: string;
	score?: number;
}

export function useSearch() {
	const isSearching = useState("search:searching", () => false);

	async function search(query: string): Promise<SearchResult[]> {
		if (!query.trim()) {
			return [];
		}

		isSearching.value = true;

		try {
			return await $fetch<SearchResult[]>("/api/search", {
				query: { q: query },
			});
		} catch (error) {
			console.error("Search failed", error);
			return [];
		} finally {
			isSearching.value = false;
		}
	}

	return {
		isSearching,
		search,
	};
}
