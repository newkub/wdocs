import type { WDocsConfig } from '../shared/types'

export default defineAppConfig({
  wdocs: {
    title: 'WDocs',
    description: 'A VitePress-like documentation system built with Nuxt.',
    // SEO and social media
    socials: {
      github: 'your-github/repo',
      twitter: '@your-twitter-handle'
    },
    // Header configuration
    header: {
      logo: true, // or a path to a custom logo
      nav: [
        { text: 'Guide', link: '/guide/introduction' },
        { text: 'Features', link: '/features/markdown-extensions' },
        { text: 'Community', link: 'https://github.com' }
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
      copyright: 'Copyright © 2024-present Your Name'
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
