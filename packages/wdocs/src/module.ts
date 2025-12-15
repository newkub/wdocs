import { defineNuxtModule, createResolver, addComponentsDir, addLayout, installModule } from '@nuxt/kit'

export interface ModuleOptions {
  /**
   * The name of the site.
   * @default 'WDocs'
   */
  name: string;
  /**
   * The description of the site.
   * @default 'A documentation site.'
   */
  description: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'wdocs',
    configKey: 'wdocs'
  },
  defaults: {
    name: 'WDocs',
    description: 'A documentation site.'
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Nuxt automatically merges app.config files from layers.
    // We just need to expose the module options to the runtime config.
    nuxt.options.runtimeConfig.public.wdocs = options

    // Add components
    await addComponentsDir({
      path: resolve('./runtime/theme/app/components'),
      prefix: 'WDocs'
    })

    // Add layouts
    addLayout({ src: resolve('./runtime/theme/app/layouts/docs.vue') }, 'docs')
    addLayout({ src: resolve('./runtime/theme/app/layouts/home.vue') }, 'home')
    addLayout({ src: resolve('./runtime/theme/app/layouts/blog.vue') }, 'blog')

    // Add CSS
    nuxt.options.css.push(resolve('./runtime/theme/app/assets/css/main.css'))

    // Install dependencies
    await installModule('@nuxtjs/color-mode')
    await installModule('@nuxt/icon')
    await installModule('@unocss/nuxt')
    await installModule('@vueuse/nuxt')
    await installModule('@pinia/nuxt')
  }
})
