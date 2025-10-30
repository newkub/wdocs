import type { Preset, UserConfig } from 'unocss'
import type { IconifyJSON } from '@iconify/types'
import { presetIcons, presetWind4 } from 'unocss'

export interface WrikkaThemeOptions {
  prefix?: string
  icons?: {
    enabled?: boolean
    collections?: Record<string, () => Promise<{ default: IconifyJSON }>>
    scale?: number
    cdn?: string
  }
  wind?: {
    enabled?: boolean
  }
  colors?: Record<string, Record<string, string>>
  spacing?: Record<string, string>
  fontSize?: Record<string, string | [string, { lineHeight: string }]>
  borderRadius?: Record<string, string>
}

export const defaultTheme = {
  animation: {
    durations: {
      'fade-in-up': '0.4s',
      'fade-out': '0.2s',
    },
    keyframes: {
      'fade-in-up': '{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}',
      'fade-out': '{from{opacity:1}to{opacity:0}}',
    },
    timingFns: {
      'fade-in-up': 'cubic-bezier(0.16, 1, 0.3, 1)',
      'fade-out': 'ease-out',
    },
  },
  borderRadius: {
    lg: '1rem',
    md: '0.5rem',
    sm: '0.25rem',
  },
  colors: {
    background: {
      active: 'var(--background-active)',
      normal: 'var(--background-normal)',
    },
    border: {
      active: 'var(--border-active)',
      normal: 'var(--border-normal)',
    },
    danger: {
      active: 'var(--danger-active)',
      normal: 'var(--danger-normal)',
    },
    info: {
      active: 'var(--info-active)',
      normal: 'var(--info-normal)',
    },
    success: {
      active: 'var(--success-active)',
      normal: 'var(--success-normal)',
    },
    warning: {
      active: 'var(--warning-active)',
      normal: 'var(--warning-normal)',
    },
  },
  fontSize: {
    lg: ['1.25rem', { lineHeight: '1.75rem' }],
    md: ['1rem', { lineHeight: '1.5rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
  },
  spacing: {
    lg: '2rem',
    md: '1rem',
    sm: '0.5rem',
  },
}

export function wrikkaPreset(): Preset {
  return {
    name: 'wrikka-preset',
    theme: {
      animation: defaultTheme.animation,
      borderRadius: {
        ...defaultTheme.borderRadius,
      },
      colors: {
        ...defaultTheme.colors,
      },
      fontSize: {
        ...defaultTheme.fontSize,
      },
      spacing: {
        ...defaultTheme.spacing,
      },
    },
  }
}

export function presetWrikkaTheme(options: WrikkaThemeOptions = {}): UserConfig {
  const {
    prefix = '',
    icons = { enabled: true },
    wind = { enabled: true },
    colors = {},
    spacing = {},
    fontSize = {},
    borderRadius = {},
  } = options

  const presets: Preset[] = []

  // Add Wind preset if enabled
  if (wind.enabled !== false) {
    presets.push(presetWind4())
  }

  // Add Icons preset if enabled
  if (icons.enabled !== false) {
    presets.push(
      presetIcons({
        scale: icons.scale || 1.2,
        cdn: icons.cdn,
        collections: icons.collections || {
          logos: () => import('@iconify-json/logos/icons.json').then((i) => i.default),
          mdi: () => import('@iconify-json/mdi/icons.json').then((i) => i.default),
        },
      })
    )
  }

  // Add Wrikka theme preset
  presets.push({
    name: 'wrikka-theme',
    theme: {
      animation: defaultTheme.animation,
      borderRadius: {
        ...defaultTheme.borderRadius,
        ...borderRadius,
      },
      colors: {
        ...defaultTheme.colors,
        ...colors,
      },
      fontSize: {
        ...defaultTheme.fontSize,
        ...fontSize,
      },
      spacing: {
        ...defaultTheme.spacing,
        ...spacing,
      },
    },
  })

  return {
    presets,
  }
}