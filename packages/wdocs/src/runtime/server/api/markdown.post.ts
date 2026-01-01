import { defineEventHandler, readBody } from 'h3'
import { parseMarkdown } from '../utils/markdown'

export default defineEventHandler(async (event) => {
  const { content } = await readBody(event)
  const { html, toc } = await parseMarkdown(content)
  return { html, headings: toc }
})
