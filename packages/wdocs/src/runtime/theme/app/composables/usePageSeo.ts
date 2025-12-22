import { computed } from 'vue'
import { useHead, useSeoMeta } from '#imports'
import type { PageContent } from '../../shared/types/content'

export function usePageSeo(page: Ref<PageContent | undefined>) {
  const { wdocs } = useAppConfig()

  const siteName = computed(() => wdocs.title || 'WDocs')
  const defaultDescription = computed(() => wdocs.description || 'A documentation site.')
  const defaultImage = '/og-image.png'

  const title = computed(() => page.value?.title || siteName.value)
  const _image = computed(() => page.value?.image || defaultImage)
  const favicon = computed(() => page.value?.favicon || '/favicon.ico')

  useHead({
    title,
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: favicon,
      },
    ],
  })

  useSeoMeta({
    title: () => page.value?.title || siteName.value,
    description: () => page.value?.description || defaultDescription.value,
    ogTitle: () => page.value?.['og:title'] || page.value?.title || siteName.value,
    ogDescription: () => page.value?.['og:description'] || page.value?.description || defaultDescription.value,
    ogImage: () => page.value?.image || defaultImage,
    ogType: () => page.value?.['og:type'] || 'article',
    twitterCard: () => page.value?.['twitter:card'] || 'summary_large_image',
    twitterCreator: () => page.value?.['twitter:creator'],
  })
}
