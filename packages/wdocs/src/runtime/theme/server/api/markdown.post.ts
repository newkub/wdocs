import { defineEventHandler, readBody } from 'h3'
import { parseMarkdown } from '../utils/markdown-parser'

export default defineEventHandler(async (event) => {
  const { content } = await readBody(event)
  const { html, headings } = await parseMarkdown(content)
  return { html, headings }
})
