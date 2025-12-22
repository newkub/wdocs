import { defineEventHandler } from 'h3'
import path from 'node:path'
import { getAllMarkdownFiles } from '../utils/content'

export default defineEventHandler(async () => {
  const contentDir = path.join(process.cwd(), 'content')
  const searchData = await getAllMarkdownFiles(contentDir)
  return searchData
})
