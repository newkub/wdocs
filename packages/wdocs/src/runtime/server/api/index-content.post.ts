import { glob } from 'glob'
import matter from 'gray-matter'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineEventHandler(async (_event) => {
  const { wdocs } = useRuntimeConfig()

  const contentDir = resolve(process.cwd(), 'content')
  const files = await glob('**/*.md', { cwd: contentDir })

  const documentsToIndex = await Promise.all(
    files.map(async (file) => {
      const filePath = resolve(contentDir, file)
      const raw = await readFile(filePath, 'utf-8')
      const { data, content } = matter(raw)

      const docPath = `/${file.replace(/\\/g, '/').replace(/\.md$/, '')}`

      return {
        id: docPath,
        title: (data?.title as string | undefined) ?? '',
        content,
        path: docPath,
      }
    })
  )

  try {
    if (!wdocs.indexerUrl) {
      return { status: 'skipped', reason: 'WDOCS_INDEXER_URL is not configured', indexed: 0 }
    }

    await $fetch(`${wdocs.indexerUrl}/wdocs/documents`, {
      method: 'POST',
      body: documentsToIndex
    })
    return { status: 'success', indexed: documentsToIndex.length }
  } catch (error) {
    console.error('Error indexing content:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to index content'
    })
  }
})
