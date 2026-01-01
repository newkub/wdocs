
import { defineEventHandler, getRouterParam, type H3Event } from 'h3'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { parseMarkdown } from '../../utils/markdown'

export default defineEventHandler(async (event: H3Event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw new Error('Slug is required')
  }

  const filePath = path.join(process.cwd(), 'content', `${slug}.md`)

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const { data: frontmatter, content } = matter(fileContent)

    const { html, toc } = await parseMarkdown(content)

    return {
      frontmatter,
      html,
      toc,
      slug,
    }
  } catch (error) {
    console.error(error)
    return { error: 'Page not found' }
  }
})
