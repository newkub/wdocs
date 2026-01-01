import { defineEventHandler, getQuery } from 'h3'
import { searchIndex } from '~/server/utils/search'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)?.q?.toString()

  if (!query) {
    return []
  }

  if (!searchIndex) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Search index is not available.',
    })
  }

  const results = searchIndex.search(query)

  // The Rust search returns a map, we need to format it for the client
  return results.map(doc => doc.fields)
})

