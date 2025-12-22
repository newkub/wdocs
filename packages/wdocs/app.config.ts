export default defineAppConfig({
  docus: {
    title: 'wdocs',
    description: 'The best place to start your documentation.',
    image: 'https://user-images.githubusercontent.com/904724/185365452-87b7ca7b-6030-4813-a2a1-da174b27a390.svg',

    socials: {
      github: 'wattanx/wdocs',
    },

    header: {
      logo: true,
      showLinkIcon: true,
      exclude: [],
      fluid: true
    },

    main: {
      fluid: true,
      padded: true
    },

    footer: {
      credits: {
        icon: 'IconDocus',
        text: 'Powered by Docus',
        href: 'https://docus.dev',
      },
      iconLinks: [],
      textLinks: [],
      fluid: true
    },

    aside: {
      level: 0,
      collapsed: false,
      exclude: []
    },

    navigation: [
      {
        title: 'Get Started',
        url: '/guide/getting-started'
      },
      {
        title: 'Components',
        url: '/components'
      },
      {
        title: 'Features',
        url: '/features'
      },
      {
        title: 'Showcase',
        children: [
          {
            title: 'Docs',
            url: '/showcase/docs'
          },
          {
            title: 'API Docs',
            url: '/showcase/api-docs'
          }
        ]
      }
    ]
  }
})
