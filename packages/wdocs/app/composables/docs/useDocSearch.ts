import { useDebounceFn } from "@vueuse/core";
import { ref, watch } from "vue";
import type { SearchResult } from "~/types/docs";

export const useDocSearch = () => {
	const searchQuery = ref("");
	const searchResults = ref<SearchResult[]>([]);
	const isSearchOpen = ref(false);

	const search = async () => {
		if (searchQuery.value.length < 2) {
			searchResults.value = [];
			isSearchOpen.value = false;
			return;
		}

		const { data } = await useFetch<SearchResult[]>("/api/docs/search", {
			params: { q: searchQuery.value },
		});

		if (data.value) {
			searchResults.value = data.value;
			isSearchOpen.value = true;
		}
	};

	const debouncedSearch = useDebounceFn(search, 300);

	watch(searchQuery, debouncedSearch);

	const closeSearch = () => {
		isSearchOpen.value = false;
	};

	return {
		searchQuery,
		searchResults,
		isSearchOpen,
		closeSearch,
	};
};
