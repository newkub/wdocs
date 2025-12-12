export const useDoc = (slug: string | string[]) => {
	const path = Array.isArray(slug) ? slug.join("/") : slug;
	return useFetch(`/api/docs/${path}`);
};
