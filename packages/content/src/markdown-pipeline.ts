import type MarkdownIt from "markdown-it";
import type { Heading } from "./types";

export interface MarkdownEnv {
	toc: Heading[];
	meta?: Record<string, unknown>;
}

export interface MarkdownTransformer {
	name: string;
	apply: (md: MarkdownIt, options?: unknown) => void;
	priority?: number;
}

export interface MarkdownCacheEntry {
	html: string;
	toc: Heading[];
	timestamp: number;
}

export class MarkdownCache {
	private cache = new Map<string, MarkdownCacheEntry>();
	private ttl: number;

	constructor(ttl: number = 5 * 60 * 1000) {
		this.ttl = ttl;
	}

	get(key: string): MarkdownCacheEntry | null {
		const entry = this.cache.get(key);
		if (!entry) return null;

		if (Date.now() - entry.timestamp > this.ttl) {
			this.cache.delete(key);
			return null;
		}

		return entry;
	}

	set(key: string, value: MarkdownCacheEntry): void {
		this.cache.set(key, value);
	}

	clear(): void {
		this.cache.clear();
	}

	delete(key: string): void {
		this.cache.delete(key);
	}

	get size(): number {
		return this.cache.size;
	}
}

export class MarkdownPipeline {
	private transformers: MarkdownTransformer[] = [];
	private cache: MarkdownCache;
	private parser: MarkdownIt | null = null;

	constructor(cache: MarkdownCache) {
		this.cache = cache;
	}

	addTransformer(transformer: MarkdownTransformer): this {
		this.transformers.push(transformer);
		this.transformers.sort((a, b) => (b.priority || 0) - (a.priority || 0));
		this.parser = null;
		return this;
	}

	addTransformers(transformers: MarkdownTransformer[]): this {
		transformers.forEach((t) => this.addTransformer(t));
		return this;
	}

	clearTransformers(): this {
		this.transformers = [];
		this.parser = null;
		return this;
	}

	async build(md: MarkdownIt): Promise<MarkdownIt> {
		for (const transformer of this.transformers) {
			transformer.apply(md);
		}
		return md;
	}

	async parse(markdown: string, useCache = true): Promise<{ html: string; toc: Heading[] }> {
		const cacheKey = this.generateCacheKey(markdown);

		if (useCache) {
			const cached = this.cache.get(cacheKey);
			if (cached) {
				return { html: cached.html, toc: cached.toc };
			}
		}

		if (!this.parser) {
			const { default: MarkdownIt } = await import("markdown-it");
			this.parser = await this.build(MarkdownIt({ html: true }));
		}

		const env: MarkdownEnv = { toc: [] };
		const html = this.parser.render(markdown, env);

		const result = { html, toc: env.toc };

		if (useCache) {
			this.cache.set(cacheKey, {
				html: result.html,
				toc: result.toc,
				timestamp: Date.now(),
			});
		}

		return result;
	}

	invalidate(): void {
		this.cache.clear();
		this.parser = null;
	}

	private generateCacheKey(content: string): string {
		let hash = 0;
		for (let i = 0; i < content.length; i++) {
			const char = content.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash;
		}
		return `md_${hash}`;
	}
}
