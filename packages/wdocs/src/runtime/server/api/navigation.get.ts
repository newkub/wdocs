import { defineEventHandler } from 'h3'
import path from 'node:path'
import { readDirRecursive } from '../utils/content'

export default defineEventHandler(async () => {
  const contentPath = path.join(process.cwd(), 'content')
  const navigation = await readDirRecursive(contentPath)
  return navigation
})
