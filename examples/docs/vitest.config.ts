import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'nuxt',
    coverage: {
      provider: 'v8',
      reporter: ['verbose', 'html']
    },
    typecheck: {
      checker: 'lint'
    },
  }
})
