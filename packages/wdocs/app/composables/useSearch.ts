import { ref, computed } from 'vue'
import Fuse, { type FuseResult } from 'fuse.js'
import type { SearchResult } from '../../shared/types'

export function useSearch() {
  const query = ref('')
  const results = ref<FuseResult<SearchResult>[]>([])
  const { data: searchData } = useLazyAsyncData('search-data', () => $fetch<SearchResult[]>('/api/search'), { default: () => [] })

  const fuse = computed(() => {
    if (!searchData.value) return null
    return new Fuse(searchData.value, {
      keys: ['title', 'content'],
      includeScore: true,
      threshold: 0.4,
    })
  })

  watch(query, (newQuery) => {
    if (!fuse.value || !newQuery) {
      results.value = []
      return
    }
    results.value = fuse.value.search(newQuery).slice(0, 10)
  })

  return { query, results, searchData }
}
