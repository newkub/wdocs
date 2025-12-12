import { z } from "zod";

const SearchQuery = z.object({
	q: z.string().min(2),
});

export default defineEventHandler(async (event) => {
	const query = await getValidatedQuery(event, (q) => SearchQuery.safeParse(q));

	if (!query.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid search query",
			data: query.error.issues,
		});
	}

	// Mock data, replace with actual logic
	return [
		{ path: "/getting-started", title: `Result for ${query.data.q}: Getting Started` },
		{ path: "/api-reference", title: `Result for ${query.data.q}: API Reference` },
	];
});
