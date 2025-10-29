const sidebarConfig = {
  docs: {
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Deployment', link: '/guide/deployment' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'REST API', link: '/api/rest' },
            { text: 'GraphQL', link: '/api/graphql' }
          ]
        }
      ]
    }
  }
};

export default sidebarConfig;
