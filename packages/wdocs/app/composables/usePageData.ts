import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { PageContent } from '../../shared/types'

import type { Ref } from 'vue'

export function usePageData(contents: Ref<PageContent[] | null | undefined>) {
  const { wdocs } = useAppConfig()
  const route = useRoute()

  const page = computed(() => {
    return contents.value?.find(item => item.path === route.path)
  })

  const editPageUrl = computed(() => {
    if (!wdocs.editPage?.repo || !page.value?.sourcePath) return null
    const { repo, branch, dir } = wdocs.editPage
    return `${repo}/edit/${branch}/${dir ? `${dir}/` : ''}${page.value.sourcePath}`
  })

  const lastUpdated = computed(() => {
    if (!page.value?.lastUpdated) return null
    return new Date(page.value.lastUpdated).toLocaleDateString()
  })

  return { page, editPageUrl, lastUpdated }
}
