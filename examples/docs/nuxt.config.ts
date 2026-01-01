export default defineNuxtConfig({
  modules: ['wdocs'],
  compatibilityDate: '2025-12-17',
  extends: ['wdocs'],

  wdocs: {
    name: 'My Docs',
    description: 'My custom documentation site.'
  },
})
