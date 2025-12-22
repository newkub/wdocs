// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-12-22',
    modules: [
    '@nuxtjs/color-mode',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@vue-macros/nuxt',
  ],
  devtools: { enabled: true },
})
