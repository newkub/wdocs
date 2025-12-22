import type { ColorModeInstance } from '@nuxtjs/color-mode/dist/runtime/composables'

declare module '#app' {
  interface NuxtApp {
    $colorMode: ColorModeInstance
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $colorMode: ColorModeInstance
  }
}
