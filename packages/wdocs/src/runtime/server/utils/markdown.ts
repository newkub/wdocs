import MarkdownIt from 'markdown-it'
import { fromHighlighter } from '@shikijs/markdown-it/core'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import anchor from 'markdown-it-anchor'
import container from 'markdown-it-container'
import include from 'markdown-it-include'
import mermaid from 'markdown-it-mermaid'
import type { Heading } from '../../shared/types'
import type Token from 'markdown-it'

let parser: MarkdownIt | null = null

async function createParser(): Promise<MarkdownIt> {
  const highlighter = await createHighlighterCore({
    engine: await createOnigurumaEngine(),
    themes: [
      import('shiki/themes/vitesse-light.mjs'),
      import('shiki/themes/vitesse-dark.mjs'),
    ],
    langs: [
      import('shiki/langs/javascript.mjs'),
      import('shiki/langs/typescript.mjs'),
      import('shiki/langs/vue.mjs'),
      import('shiki/langs/rust.mjs'),
      import('shiki/langs/json.mjs'),
      import('shiki/langs/shell.mjs'),
    ],
  })

  const md = MarkdownIt({ html: true })
    .use(fromHighlighter(highlighter as any, { theme: 'vitesse-light' }))
    .use(anchor, {
      permalink: anchor.permalink.ariaHidden({ placement: 'before' }),
      slugify: (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      callback: (token: Token, info: { title: string; slug: string }, env: any) => {
        if (token.tag.match(/^h[1-6]$/) && env.toc) {
          env.toc.push({ 
            title: info.title, 
            slug: info.slug, 
            depth: parseInt(token.tag.substring(1), 10),
            level: parseInt(token.tag.substring(1), 10)
          })
        }
      }
    })
    .use(container, 'info')
    .use(container, 'tip')
    .use(container, 'warning')
    .use(include, { root: process.cwd() })
    .use(mermaid)

  const defaultFence = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    if (!token) {
      return ''
    }
    const rawCode = token.content
    const rendered = defaultFence
      ? defaultFence(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)

    return `<div class="code-block-wrapper relative group">
              <button class="copy-code-button absolute top-2 right-2 p-1.5 rounded-md bg-gray-800/70 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" data-code="${encodeURIComponent(rawCode)}">
                Copy
              </button>
              ${rendered}
            </div>`
  }

  return md
}

export async function parseMarkdown(markdown: string): Promise<{ html: string; toc: Heading[] }> {
  if (!parser) {
    parser = await createParser()
  }
  const env = { toc: [] as Heading[] }
  const html = parser.render(markdown, env)
  return { html, toc: env.toc }
}

