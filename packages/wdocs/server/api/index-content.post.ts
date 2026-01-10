import { contentManager } from "../utils/content";

export default defineEventHandler(async (_event) => {
	const { wdocs } = useRuntimeConfig();

	const documentsToIndex = await contentManager.getAllDocumentsForIndexing();

	try {
		if (!wdocs.indexerUrl) {
			return {
				status: "skipped",
				reason: "WDOCS_INDEXER_URL is not configured",
				indexed: 0,
			};
		}

		await $fetch(`${wdocs.indexerUrl}/wdocs/documents`, {
			method: "POST",
			body: documentsToIndex,
		});
		return { status: "success", indexed: documentsToIndex.length };
	} catch (error) {
		console.error("Error indexing content:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Failed to index content",
		});
	}
});
