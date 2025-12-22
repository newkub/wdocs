
export const useThemes = () => {
  const colorMode = useColorMode()

  const themes = [
    { name: 'light', icon: 'mdi:white-balance-sunny' },
    { name: 'dark', icon: 'mdi:weather-night' },
    { name: 'sepia', icon: 'mdi:image-filter-drama' },
    { name: 'cyberpunk', icon: 'mdi:robot' },
    { name: 'dracula', icon: 'mdi:vampire' },
  ]

  const currentTheme = computed(() => {
    return themes.find(t => t.name === colorMode.preference) || themes[0]
  })

  const cycleThemes = () => {
    const currentIndex = themes.findIndex(t => t.name === colorMode.preference)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    if (nextTheme) {
      colorMode.preference = nextTheme.name
    }
  }

  return {
    themes,
    cycleThemes,
    currentTheme,
  }
}
