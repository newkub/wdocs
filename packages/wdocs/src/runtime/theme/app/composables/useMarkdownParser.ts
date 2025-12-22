import { ref, watchEffect } from 'vue'
import type { Ref } from 'vue'
import type { Heading, MarkdownApiResponse } from '../../shared/types/markdown'

export function useMarkdownParser(markdownContent: Ref<string>) {
  const renderedMarkdown = ref('')
  const headings = ref<Heading[]>([])

  watchEffect(async () => {
    if (markdownContent.value) {
      const { html, headings: newHeadings } = await $fetch<MarkdownApiResponse>('/api/markdown', {
        method: 'POST',
        body: { content: markdownContent.value },
      })
      renderedMarkdown.value = html
      headings.value = newHeadings
    } else {
      renderedMarkdown.value = ''
      headings.value = []
    }
  })

  return { renderedMarkdown, headings }
}

