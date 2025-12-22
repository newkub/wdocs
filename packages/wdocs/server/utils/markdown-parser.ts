import MarkdownIt from 'markdown-it'
import type { Heading } from '../../shared/types'
import anchor from 'markdown-it-anchor'
import container from 'markdown-it-container'
import shiki from '@shikijs/markdown-it'

let mdParser: MarkdownIt | null = null

function extractHeadings(md: MarkdownIt, markdown: string): Heading[] {
  const tokens = md.parse(markdown, {})
  const headings: Heading[] = []

  tokens.forEach((token, i) => {
    if (token.type === 'heading_open') {
      const nextToken = tokens[i + 1]
      if (nextToken && nextToken.type === 'inline' && nextToken.children) {
        const title = nextToken.children.filter(t => t.type === 'text').map(t => t.content).join('')
        const slug = token.attrGet('id') || ''
        const level = Number.parseInt(token.tag.substring(1), 10)
        headings.push({ level, title, slug, depth: level })
      }
    }
  })

  return headings
}

export async function getMarkdownParser(): Promise<MarkdownIt> {
  if (mdParser) {
    return mdParser
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
      slugify: (s: string) => String(s).trim().toLowerCase().replace(/\s+/g, '-'),
    });

  for (const type of ['info', 'warning', 'danger']) {
    md.use(container, type, {
      validate: (params: string) => {
        return params.trim().match(new RegExp(`^${type}(s+(.*))?$`));
      },
      render: (tokens: { info: string; nesting: number }[], idx: number) => {
        const token = tokens[idx];
        if (!token) return '';

        const m = token.info.trim().match(new RegExp(`^${type}(s+(.*))?$`));
        if (token.nesting === 1) {
          const title = m?.[2] ? md.renderInline(m[2]) : type.charAt(0).toUpperCase() + type.slice(1);
          return `<div class="custom-container ${type}"><p class="custom-container-title">${title}</p>\n`;
        }
        return '</div>\n';
      }
    });
  }

  mdParser = md;
  return mdParser;
}

export async function parseMarkdown(markdown: string) {
  const parser = await getMarkdownParser()
  const headings = extractHeadings(parser, markdown)
  const html = parser.render(markdown)
  return { html, headings }
}
