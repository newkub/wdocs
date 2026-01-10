import { MarkdownPipeline } from "../../../../src/markdown-pipeline.js";
import { MarkdownCache } from "../../../../src/markdown-pipeline.js";
import { createAnchorTransformer, createHighlighterTransformer, createMermaidTransformer, createCodeCopyTransformer } from "../../../../src/markdown-transformers.js";
import { createHighlighter } from "shiki";

const cache = new MarkdownCache(5 * 60 * 1000);
const pipeline = new MarkdownPipeline(cache);

async function initializePipeline() {
	if (pipeline) {
		const highlighter = await createHighlighter({
			themes: ["vitesse-light", "vitesse-dark"],
			langs: ["javascript", "typescript", "rust", "python", "bash", "json", "markdown"],
		});

		pipeline
			.addTransformer(createHighlighterTransformer(highlighter, "vitesse-light"))
			.addTransformer(createAnchorTransformer())
			.addTransformer(createMermaidTransformer())
			.addTransformer(createCodeCopyTransformer());
	}
}

void initializePipeline();

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const { markdown } = body;

	if (!markdown) {
		throw createError({ statusCode: 400, message: "Markdown is required" });
	}

	try {
		return await pipeline.parse(markdown);
	} catch (error) {
		console.error("Failed to parse markdown", error);
		throw createError({ statusCode: 500, message: "Failed to parse markdown" });
	}
});
