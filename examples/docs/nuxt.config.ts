import checker from "vite-plugin-checker";

export default defineNuxtConfig({
  wdocs: {
    name: 'My Docs',
    description: 'My custom documentation site.'
  },

  compatibilityDate: "latest",
  devtools: { enabled: true },
  modules: [
    'wdocs',
    "@vue-macros/nuxt",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@pinia/nuxt",
    "nuxt-mcp-dev",
    "@nuxt/icon",
    "@scalar/nuxt"
  ],

  alias: {
    '~/shared': './shared'
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  scalar: {
    url: 'https://registry.scalar.com/@scalar/apis/galaxy?format=yaml',
  },

  icon: {
    serverBundle: {
      collections: ['mdi']
    }
  },

  nitro: {
    preset: "cloudflare_module", // @ai bun add wrangler ด้วย
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        routes: [
          {
            pattern: "*docs.com", // @ai กำหนด * ตามชื่อ folder
            custom_domain: true,
          },
        ]
      }
    },
  },
  vite: {
    plugins: [
      checker({
        overlay: {
          initialIsOpen: false,
        },
        typescript: true,
        vueTsc: true,
        oxlint: true,
      }),
    ],
  }
});
