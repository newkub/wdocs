import mermaid from 'mermaid'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    mermaid.initialize({ startOnLoad: false })
    mermaid.run({ querySelector: '.mermaid' })
  })
})
