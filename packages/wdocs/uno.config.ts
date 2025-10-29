import { defineConfig, presetWind4, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      scale: 1.2,
      warn: true
    }),
  ],
  shortcuts: [],
  rules: [],
  theme: {
    colors: {}
  }
})