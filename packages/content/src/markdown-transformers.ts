import anchor from "markdown-it-anchor";
import container from "markdown-it-container";
import include from "markdown-it-include";
import mermaid from "markdown-it-mermaid";
import { fromHighlighter } from "@shikijs/markdown-it/core";
import type { Highlighter } from "shiki/core";
import type { MarkdownTransformer, MarkdownEnv } from "./markdown-pipeline";
import type Token from "markdown-it";

export function createAnchorTransformer(): MarkdownTransformer {
	return {
		name: "anchor",
		priority: 100,
		apply: (md) => {
			md.use(anchor, {
				permalink: anchor.permalink.ariaHidden({ placement: "before" }),
				slugify: (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
				callback: (
					token: Token,
					info: { title: string; slug: string },
					env: MarkdownEnv,
				) => {
					if (token.tag.match(/^h[1-6]$/) && env.toc) {
						env.toc.push({
							title: info.title,
							slug: info.slug,
							depth: parseInt(token.tag.substring(1), 10),
							level: parseInt(token.tag.substring(1), 10),
						});
					}
				},
			});
		},
	};
}

export function createContainerTransformer(type: string): MarkdownTransformer {
	return {
		name: `container-${type}`,
		priority: 90,
		apply: (md) => {
			md.use(container, type);
		},
	};
}

export function createIncludeTransformer(root: string): MarkdownTransformer {
	return {
		name: "include",
		priority: 80,
		apply: (md) => {
			md.use(include, { root });
		},
	};
}

export function createMermaidTransformer(): MarkdownTransformer {
	return {
		name: "mermaid",
		priority: 70,
		apply: (md) => {
			md.use(mermaid);
		},
	};
}

export function createHighlighterTransformer(highlighter: Highlighter, theme = "vitesse-light"): MarkdownTransformer {
	return {
		name: "highlighter",
		priority: 200,
		apply: (md) => {
			md.use(fromHighlighter(highlighter, { theme }));
		},
	};
}

export function createCodeCopyTransformer(): MarkdownTransformer {
	return {
		name: "code-copy",
		priority: 50,
		apply: (md) => {
			const defaultFence = md.renderer.rules.fence;
			md.renderer.rules.fence = (tokens, idx, options, env, self) => {
				const token = tokens[idx];
				if (!token) {
					return "";
				}
				const rawCode = token.content;
				const rendered = defaultFence
					? defaultFence(tokens, idx, options, env, self)
					: self.renderToken(tokens, idx, options);

				return `<div class="code-block-wrapper relative group">
              <button class="copy-code-button absolute top-2 right-2 p-1.5 rounded-md bg-gray-800/70 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" data-code="${
					encodeURIComponent(rawCode)
				}">
                Copy
              </button>
              ${rendered}
            </div>`;
			};
		},
	};
}

export function createAlertTransformer(): MarkdownTransformer {
	return {
		name: "alert",
		priority: 60,
		apply: (md) => {
			md.renderer.rules.container_open = (_tokens, _idx, _options, _env, _self) => {
				return `<div class="alert">`;
			};

			md.renderer.rules.container_close = (_tokens, _idx, _options, _env, _self) => {
				return `</div>`;
			};
		},
	};
}
