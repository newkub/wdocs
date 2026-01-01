import { defineNuxtModule, createResolver } from '@nuxt/kit'
import type { WDocsConfig } from '../shared/types'

export default defineNuxtModule<WDocsConfig>({
  meta: {
    name: 'wdocs',
    configKey: 'wdocs',
  },
  defaults: {},
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.alias = {
      ...nuxt.options.alias,
      '~wdocs': resolver.resolve('..'),
      '~wdocs/*': resolver.resolve('../*'),
    }
  },
})
