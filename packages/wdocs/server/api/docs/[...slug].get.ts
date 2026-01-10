import { defineEventHandler, getRouterParam, setResponseStatus } from "h3";
import { contentManager } from "../../utils/content";

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, "slug");
	if (!slug) {
		setResponseStatus(event, 400);
		return { error: "Slug is required" };
	}

	try {
		const pageData = await contentManager.getContentBySlug(slug);

		if (!pageData) {
			setResponseStatus(event, 404);
			return { error: "Page not found" };
		}

		return pageData;
	} catch (error) {
		console.error(`Error fetching document for slug: ${slug}`, error);
		setResponseStatus(event, 500);
		return { error: "Failed to fetch document" };
	}
});
