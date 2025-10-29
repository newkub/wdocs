const navConfig = {
  app: {
    head: {},
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  content: {
    navigation: {
      fields: ['navTitle']
    },
    documentDriven: true,
    markdown: {
      anchorLinks: { depth: 3 },
      remarkPlugins: [
        'remark-math',
        'remark-gfm'
      ],
      rehypePlugins: [
        'rehype-katex'
      ]
    },
    highlight: {
      theme: 'github-dark',
      preload: ['javascript','typescript','vue','bash']
    }
  }
};

export default navConfig;
