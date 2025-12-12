import type { NavigationItem } from "~/types/docs";

export const useDocsNavigation = () => {
	return useFetch<NavigationItem[]>("/api/docs/navigation", { key: "navigation" });
};
