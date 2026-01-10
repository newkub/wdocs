import { defineEventHandler, readBody } from "h3";
import { contentManager } from "../utils/content";
import { validateHeading } from "@wdocs/content/validation";

export default defineEventHandler(async (event) => {
	const { content } = await readBody(event);
	if (!content) {
		return { html: "", headings: [] };
	}
	const { html, toc } = await contentManager.parseMarkdown(content);

	const validatedToc = toc.map((heading) => validateHeading(heading));

	return { html, headings: validatedToc };
});
