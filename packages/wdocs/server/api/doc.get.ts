import { defineEventHandler, getQuery, createError } from 'h3'
import { readDoc } from '../utils/content'
import { parseMarkdown } from '../utils/markdown-parser'

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const docPath = query.path as string;

  if (!docPath) {
    throw createError({ statusCode: 400, statusMessage: 'Document path is required' });
  }

  try {
    const { frontmatter, markdownContent } = await readDoc(docPath);
    const { html, headings } = await parseMarkdown(markdownContent);

    return { frontmatter, html, toc: headings };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error processing doc: ${error.message}`);
    } else {
      console.error('An unknown error occurred while processing the doc');
    }
    return createError({ statusCode: 404, statusMessage: `Document not found at ${docPath}` });
  }
});
