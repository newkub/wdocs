export default defineNuxtPlugin((nuxtApp) => {
  const colorMode = useColorMode()

  watch(() => colorMode.preference, (newTheme) => {
    document.body.className = `theme-${newTheme}`
  })

  nuxtApp.hook('app:mounted', () => {
    document.body.className = `theme-${colorMode.preference}`
  })
})
