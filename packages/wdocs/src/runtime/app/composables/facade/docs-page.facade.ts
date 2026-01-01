export function useDocsPageFacade() {
  const route = useRoute()
  const slug = computed(() => (route.params.slug as string[]).join('/'))

  const { fetchPageBySlug } = useContentService()
  const { data: pageData, pending: isLoading, error: fetchError } = fetchPageBySlug(slug)

  const hasError = computed(() => !!fetchError.value)
  const frontmatter = computed(() => pageData.value?.frontmatter)
  const toc = computed(() => pageData.value?.toc || [])

  // Handle SEO and other side effects
  // These could be moved to core composables if they grow in complexity
  usePageSeo(pageData)
  useTableOfContents(toc)

  return {
    pageData,
    isLoading,
    hasError,
    frontmatter,
    toc,
  }
}
