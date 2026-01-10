import { watchDebounced } from "@vueuse/core";
import { ref } from "vue";
import type { SearchResult } from "~/shared/types";

export function useSearch() {
	const query = ref("");
	const results = ref<SearchResult[]>([]);
	const loading = ref(false);

	watchDebounced(
		query,
		async (newQuery) => {
			if (!newQuery) {
				results.value = [];
				return;
			}

			loading.value = true;
			try {
				// Use the new search API endpoint
				const response = await $fetch<SearchResult[]>("/api/search", {
					params: { q: newQuery },
				});
				results.value = response;
			} catch (error) {
				console.error("Error fetching search results:", error);
				results.value = [];
			} finally {
				loading.value = false;
			}
		},
		{ debounce: 300, maxWait: 1000 },
	);

	return { query, results, loading };
}
