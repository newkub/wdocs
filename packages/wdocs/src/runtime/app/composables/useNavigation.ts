import { computed } from 'vue'

interface NavItem {
  link: string
}

interface NavGroup {
  items: NavItem[]
}
import { useRoute } from 'vue-router'

export function useNavigation() {
  const { wdocs } = useAppConfig()
  const route = useRoute()

  const _flatNav = computed(() => {
    const nav = wdocs.sidebar[Object.keys(wdocs.sidebar).find(key => route.path.startsWith(key)) || ''] || []
    return nav.flatMap((group: NavGroup) => group.items)
  })

  const currentPageIndex = computed(() => {
    return _flatNav.value.findIndex((item: NavItem) => item.link === route.path)
  })

  const prevPage = computed(() => {
    if (currentPageIndex.value > 0) {
      return _flatNav.value[currentPageIndex.value - 1]
    }
    return null
  })

  const nextPage = computed(() => {
    if (currentPageIndex.value < _flatNav.value.length - 1) {
      return _flatNav.value[currentPageIndex.value + 1]
    }
    return null
  })

  return { prevPage, nextPage }
}
