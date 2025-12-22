import type MarkdownIt from 'markdown-it'

export default function markdownItCodeCopy(md: MarkdownIt) {
  const defaultFence = md.renderer.rules.fence;

  if (!defaultFence) {
    return;
  }

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (!token) {
      return '';
    }
    const rawCode = token.content;
    const rendered = defaultFence(tokens, idx, options, env, self);

    return `
      <div class="relative group prose-code">
        <button 
          class="copy-code-button absolute top-2 right-2 p-1.5 rounded-md bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          data-code="${md.utils.escapeHtml(rawCode)}"
          aria-label="Copy code to clipboard"
        >
          <span class="copy-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2zm-4 4V6a2 2 0 0 1 2-2h8"/></svg>
          </span>
          <span class="copied-icon hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12l5 5L20 7"/></svg>
          </span>
        </button>
        ${rendered}
      </div>
    `;
  };
}
