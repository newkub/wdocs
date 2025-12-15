import { defineEventHandler, getQuery, createError } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import container from 'markdown-it-container'
import shiki from '@shikijs/markdown-it'

// Singleton instance of the markdown parser
let mdParser: MarkdownIt | null = null;

async function getMarkdownParser() {
  if (mdParser) {
    return mdParser;
  }

  const md = new MarkdownIt({ html: true })
    .use(await shiki({
      themes: {
        light: 'vitesse-light',
        dark: 'vitesse-dark',
      }
    }))
    .use(anchor, {
      permalink: anchor.permalink.ariaHidden({
        placement: 'before',
        symbol: '#',
      }),
      slugify: s => String(s).trim().toLowerCase().replace(/\s+/g, '-'),
    });

  // Custom containers
  ['info', 'warning', 'danger'].forEach(type => {
    md.use(container as any, type, {
      validate: (params: string) => {
        return params.trim().match(new RegExp(`^${type}(s+(.*))?$`));
      },
      render: (tokens: any[], idx: number) => {
        const m = tokens[idx].info.trim().match(new RegExp(`^${type}(s+(.*))?$`));
        if (tokens[idx].nesting === 1) {
          const title = m && m[2] ? md.renderInline(m[2]) : type.charAt(0).toUpperCase() + type.slice(1);
          return `<div class="custom-container ${type}"><p class="custom-container-title">${title}</p>\n`;
        }
        return '</div>\n';
      }
    });
  });

  mdParser = md;
  return mdParser;
}

export default defineEventHandler(async (event) => {
  const md = await getMarkdownParser();
  const query = getQuery(event);
  const docPath = query.path as string;

  if (!docPath) {
    throw createError({ statusCode: 400, statusMessage: 'Document path is required' });
  }

  try {
    const filePath = path.join(process.cwd(), 'content', `${docPath}.md`);
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const { data: frontmatter, content: markdownContent } = matter(fileContent);

    const tokens = md.parse(markdownContent, {});
    const headings = tokens
      .filter(token => token.type === 'heading_open')
      .map((token, index) => ({
        level: parseInt(token.tag.substring(1), 10),
        text: tokens[index + 1]?.content || '',
        id: token.attrGet('id') || ''
      }));

    const html = md.render(markdownContent);

    return { frontmatter, html, toc: headings };
    } catch (error: any) {
    console.error(`Error processing doc: ${error.message}`);
    return createError({ statusCode: 404, statusMessage: `Document not found at ${docPath}` });
  }
});
