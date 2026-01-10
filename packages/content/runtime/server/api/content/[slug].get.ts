import { join } from "node:path";
import matter from "gray-matter";
import { MarkdownPipeline } from "../../../../src/markdown-pipeline.js";
import { MarkdownCache } from "../../../../src/markdown-pipeline.js";
import { createAnchorTransformer, createHighlighterTransformer, createMermaidTransformer, createCodeCopyTransformer } from "../../../../src/markdown-transformers.js";
import { FrontmatterSchema } from "../../../../src/types.js";
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
	const slug = getRouterParam(event, "slug");
	if (!slug) {
		throw createError({ statusCode: 400, message: "Slug is required" });
	}

	const config = useRuntimeConfig().public.wdocsContent;
	const contentDir = join(process.cwd(), config.contentDir || "content");
	const normalizedSlug = slug.startsWith("/") ? slug.slice(1) : slug;
	const filePath = join(contentDir, `${normalizedSlug}.md`);

	try {
		const file = Bun.file(filePath);
		const fileExists = await file.exists();
		if (!fileExists) {
			throw createError({ statusCode: 404, message: "Content not found" });
		}

		const raw = await file.text();
		const { data, content } = matter(raw);

		const frontmatter = FrontmatterSchema.parse(data);
		const { html, toc } = await pipeline.parse(content);

		return {
			slug,
			html,
			frontmatter,
			toc,
		};
	} catch (error) {
		if (error instanceof Error && "statusCode" in error) {
			throw error;
		}
		console.error(`Failed to load content for slug: ${slug}`, error);
		throw createError({ statusCode: 500, message: "Failed to load content" });
	}
});
