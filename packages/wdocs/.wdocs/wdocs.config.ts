// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { NuxtConfig } from '@nuxt/schema'
import wdocsConfig from './modules'
import navConfig from './nav'
import sidebarConfig from './sidebar'
import { markdownConfig } from './markdown'

export default {
  // App config from modules
  ...wdocsConfig,

  // Navigation config
  ...navConfig,

  // Documentation specific features
  runtimeConfig: {
    public: {
      docs: {
        title: 'Wrikka Documentation',
        description: 'Official documentation for Wrikka platform'
      }
    }
  },

  // Sidebar config
  ...sidebarConfig,

  // Markdown config
  content: {
    ...navConfig.content,
    ...markdownConfig
  },

  // Modules
  modules: [
    '@nuxt/content',
    '@nuxtjs/color-mode',
    ...wdocsConfig.modules.filter(m => m !== '@unocss/nuxt')
  ],

  // Plugins
  plugins: [
    '~/plugins/init.ts',
    '~/plugins/analytics.client.ts'
  ]
} satisfies NuxtConfig