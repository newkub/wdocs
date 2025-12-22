import type { WDocsConfig } from './config'

declare module '@nuxt/schema' {
  interface AppConfigInput {
    wdocs?: Partial<WDocsConfig>
  }
  interface AppConfig {
    wdocs: WDocsConfig
  }
}

declare module 'nuxt/schema' {
  interface AppConfigInput {
    wdocs?: Partial<WDocsConfig>
  }
  interface AppConfig {
    wdocs: WDocsConfig
  }
}
