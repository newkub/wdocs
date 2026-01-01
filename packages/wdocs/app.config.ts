import type { WDocsConfig } from './shared/types'

export default defineAppConfig({
  wdocs: {
    title: 'WDocs',
    description: 'A VitePress-like documentation system built with Nuxt.',
    socials: {
      github: '',
      twitter: ''
    },
    header: {
      logo: true, // or a path to a custom logo
      nav: [
        { text: 'Get Started', link: '/getting-started' },
        { text: 'Components', link: '/components/buttons' },
        { text: 'Showcase', link: '/showcase' },
        {
          text: 'Resources',
          items: [
            { text: 'Blog', link: '/blog' },
            { text: 'Community', link: 'https://github.com' },
            { text: 'Help', link: '/help' },
          ]
        }
      ]
    },
    // Sidebar configuration
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        }
      ],
      '/features/': [
        {
          text: 'Features',
          items: [
            { text: 'Markdown Extensions', link: '/features/markdown-extensions' },
            { text: 'Custom Components', link: '/features/custom-components' }
          ]
        }
      ]
    },
    // Footer configuration
    footer: {
      message: 'Released under the MIT License.',
      copyright: ''
    },
    editPage: {
      repo: '',
      branch: 'main',
      dir: 'content',
      text: 'Edit this page on GitHub'
    },
    theme: {
      primary: '#007bff'
    }
  } as WDocsConfig
})
