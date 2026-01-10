import type { PageData } from "~~/shared/types";

export function useContentService() {
	const fetchPageBySlug = (slug: string | Ref<string>) => {
		const slugValue = isRef(slug) ? slug.value : slug;
		return useFetch<PageData>(`/api/docs/${slugValue}`);
	};

	return {
		fetchPageBySlug,
	};
}
