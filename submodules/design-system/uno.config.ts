import { defineConfig } from 'unocss'
import { wrikkaPreset } from './plugins/unocss/wrikka-preset'

export default defineConfig({
  presets: [
    wrikkaPreset()
  ]
})
