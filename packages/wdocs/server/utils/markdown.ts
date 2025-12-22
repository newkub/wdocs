import MarkdownIt from 'markdown-it'
import { fromHighlighter } from '@shikijs/markdown-it/core'
import { createHighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import anchor from 'markdown-it-anchor'
import type { Heading } from '../../shared/types'


let highlighter: Awaited<ReturnType<typeof createHighlighterCore>>

async function getHighlighter() {
  if (highlighter) {
    return highlighter
  }
    const oniguruma = await createOnigurumaEngine()
    highlighter = await createHighlighterCore({
    engine: oniguruma,
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
  return highlighter
}

export async function createMarkdownParser() {
  const highlighter = await getHighlighter()
  const toc: Heading[] = []

  const md = MarkdownIt({ html: true })
    .use(fromHighlighter(highlighter as any, { theme: 'vitesse-light' }))
    .use(anchor, {
      permalink: anchor.permalink.ariaHidden({ placement: 'before' }),
      slugify: s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      callback: (token, info) => {
        if (token.tag.match(/^h[1-6]$/)) {
          toc.push({ 
            title: info.title, 
            slug: info.slug, 
            depth: parseInt(token.tag.substring(1), 10),
            level: parseInt(token.tag.substring(1), 10)
          })
        }
      }
    })

  return { md, toc }
}
