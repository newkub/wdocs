import { ref } from 'vue'
import type { Heading } from '../../shared/types/markdown'

export function useTableOfContents() {
  const headings = ref<Heading[]>([])

  function onHeadings(newHeadings: Heading[]) {
    headings.value = newHeadings
  }

  return { headings, onHeadings }
}
