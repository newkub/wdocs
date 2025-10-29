export const markdownConfig = {
  markdown: {
    anchorLinks: { depth: 3 },
    remarkPlugins: [
      'remark-math',
      'remark-gfm'
    ],
    rehypePlugins: [
      'rehype-katex'
    ]
  }
}
