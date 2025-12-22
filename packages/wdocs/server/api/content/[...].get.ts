import { defineEventHandler, createError } from 'h3'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import matter from 'gray-matter'
import { createMarkdownParser } from '../../utils/markdown'
import type { PageData } from '../../../shared/types'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?._ || 'index'
  const contentDir = resolve(process.cwd(), 'content')
  const filePath = resolve(contentDir, `${slug}.md`)

  try {
    const fileContent = await readFile(filePath, 'utf-8')
    const { data: frontmatter, content } = matter(fileContent)

    const { md, toc } = await createMarkdownParser()
      
    const htmlContent = md.render(content)

    const pageData: PageData = {
      slug,
      html: htmlContent,
      frontmatter,
      toc,
    }

    return pageData
  } catch (error) {
    console.error(`Error fetching content for slug "${slug}":`, error)
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found',
    })
  }
})
