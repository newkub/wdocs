import { NapiIndex } from 'search'
import { glob } from 'glob'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

let searchIndex: NapiIndex | null = null

async function createSearchIndex() {
  console.log('Creating search index...')
  const index = new NapiIndex()

  const contentDir = path.join(process.cwd(), 'content')
  const files = await glob('**/*.md', { cwd: contentDir })

  const documents = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(contentDir, file)
      const content = await readFile(filePath, 'utf-8')
      const { data, content: body } = matter(content)

      return {
        fields: {
          title: data.title || '',
          content: body,
          path: `/docs/${file.replace(/\.md$/, '')}`,
        },
      }
    })
  )

  index.addDocuments(documents)
  index.buildIndex()

  console.log(`Search index created with ${documents.length} documents.`)
  return index
}

// Initialize the index on server startup
if (process.env.NODE_ENV !== 'development' || process.env.NITRO_PRERENDER) {
  createSearchIndex().then((index) => {
    searchIndex = index
  })
} else {
  // In development, we can delay the index creation
  setTimeout(() => {
    createSearchIndex().then((index) => {
      searchIndex = index
    })
  }, 1000)
}

export { searchIndex }
