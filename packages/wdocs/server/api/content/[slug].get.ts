import { defineEventHandler, getRouterParam, type H3Event } from 'h3'
import { glob } from 'glob'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import MarkdownIt from 'markdown-it'
import * as shiki from 'shiki'
import markdownItCodeCopy from '../../../shared/utils/markdown-it-code-copy'
import matter from 'gray-matter'
import { PageDataSchema } from '../../../shared/types'

export default defineEventHandler(async (event: H3Event) => {
    const slugParam = getRouterParam(event, 'slug')
  const slug = slugParam ? slugParam.replace(/,/g, '/') : 'index'
  const contentDir = resolve(process.cwd(), '../../docs/content')
  const files = await glob(`${slug}.md`, { cwd: contentDir })

  const firstFile = files[0]
  if (!firstFile) {
    event.node.res.statusCode = 404
    return { error: 'File not found' }
  }

  const filePath = resolve(contentDir, firstFile)
  const fileContent = await readFile(filePath, 'utf-8')

  const { data: frontmatter, content } = matter(fileContent)
  const highlighter = await shiki.createHighlighter({
    themes: ['vitesse-dark'],
    langs: ['javascript', 'typescript', 'vue', 'bash', 'json', 'yaml']
  })

  const md = new MarkdownIt({ 
    html: true,
    highlight: (code, lang) => {
      return highlighter.codeToHtml(code, { lang, themes: { light: 'vitesse-light', dark: 'vitesse-dark' } })
    }
  }).use(markdownItCodeCopy)

  const html = md.render(content)

  try {
    const pageData = {
      slug,
      html,
      frontmatter,
    }
    return PageDataSchema.parse(pageData)
  } catch (error) {
    event.node.res.statusCode = 500
    return { error: 'Invalid page data structure', details: error }
  }
})
