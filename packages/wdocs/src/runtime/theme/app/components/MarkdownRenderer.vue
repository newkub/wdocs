<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { fromHighlighter } from '@shikijs/markdown-it/core'
import MarkdownIt from 'markdown-it'
import { createHighlighter, type Highlighter } from 'shiki'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import theme from '@shikijs/themes/vitesse-light'
import js from '@shikijs/langs/javascript'
import ts from '@shikijs/langs/typescript'
import vue from '@shikijs/langs/vue'

const props = defineProps<{ content: string }>()
const emit = defineEmits(['headings'])

const renderedMarkdown = ref('')
let highlighter: Highlighter | null = null
let md: MarkdownIt | null = null

async function initialize() {
  highlighter = await createHighlighter({
    themes: [theme],
    langs: [js, ts, vue],
    engine: createOnigurumaEngine(() => import('shiki/wasm'))
  })
  md = new MarkdownIt()
  if (highlighter) {
    md.use(fromHighlighter(highlighter, { theme: 'vitesse-light' }))
  }
}

function render(markdown: string) {
  if (!md || !markdown) {
    renderedMarkdown.value = ''
    emit('headings', [])
    return
  }

  const tokens = md.parse(markdown, {});
  const headings: { level: number; title: string; slug: string; }[] = [];

  tokens.forEach((token, i) => {
    if (token.type === 'heading_open') {
      const nextToken = tokens[i + 1];
      if (nextToken && nextToken.type === 'inline' && nextToken.children) {
        const title = nextToken.children.filter(t => t.type === 'text').map(t => t.content).join('');
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        token.attrSet('id', slug);
        headings.push({ level: parseInt(token.tag.substring(1)), title, slug });
      }
    }
  });

  emit('headings', headings);
  renderedMarkdown.value = md.renderer.render(tokens, md.options, {});
}

onMounted(async () => {
  await initialize()
  render(props.content)
})

watch(() => props.content, (newContent) => {
  if (md) {
    render(newContent)
  } else {
    initialize().then(() => render(newContent));
  }
})
</script>

<template>
  <div v-html="renderedMarkdown"></div>
</template>

<style>
/* Add some basic styling for the rendered markdown */
.prose {
  color: #333;
}
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}
.prose p {
  line-height: 1.6;
}
.prose pre {
  padding: 1em;
  border-radius: 6px;
  background-color: #f5f5f5;
  overflow-x: auto;
}
</style>
