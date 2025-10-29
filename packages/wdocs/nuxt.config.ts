import checker from 'vite-plugin-checker'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
  ],
  vite: {
    plugins: [
      checker({
        overlay: {
          initialIsOpen: false,
        },
        typescript: true,
        vueTsc: true,
        biome: {
          command: "lint",
        },
      })
    ]
  }
})
