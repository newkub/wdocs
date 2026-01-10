import Fuse from "fuse.js";
import type { SearchResult, ContentItem } from "../../shared/types";

export interface SearchOptions {
	limit?: number;
	threshold?: number;
	includeScore?: boolean;
	includeMatches?: boolean;
}

export interface SearchIndexItem {
	id: string;
	title: string;
	slug: string;
	path: string;
	content: string;
	tags?: string[];
}

export class SearchEngine {
	private fuse: Fuse<SearchIndexItem> | null = null;
	private index: SearchIndexItem[] = [];
	private defaultOptions: Fuse.IFuseOptions<SearchIndexItem> = {
		keys: [
			{ name: "title", weight: 2 },
			{ name: "content", weight: 1 },
			{ name: "tags", weight: 1.5 },
		],
		threshold: 0.3,
		includeScore: true,
		includeMatches: true,
		minMatchCharLength: 2,
	};

	buildIndex(items: ContentItem[]): void {
		this.index = items.map((item) => ({
			id: item.slug,
			title: item.title,
			slug: item.slug,
			path: item.path,
			content: "",
			tags: (item as any).tags || [],
		}));

		this.fuse = new Fuse(this.index, this.defaultOptions);
	}

	updateIndexContent(slug: string, content: string): void {
		const item = this.index.find((i) => i.slug === slug);
		if (item) {
			item.content = content;
			this.fuse = new Fuse(this.index, this.defaultOptions);
		}
	}

	search(query: string, options: SearchOptions = {}): SearchResult[] {
		if (!this.fuse || !query.trim()) {
			return [];
		}

		const fuseOptions: Fuse.IFuseOptions<SearchIndexItem> = {
			...this.defaultOptions,
			threshold: options.threshold ?? this.defaultOptions.threshold,
			includeScore: options.includeScore ?? true,
			includeMatches: options.includeMatches ?? true,
		};

		const searchFuse = new Fuse(this.index, fuseOptions);
		const results = searchFuse.search(query, { limit: options.limit ?? 10 });

		return results.map((result) => ({
			title: result.item.title,
			slug: result.item.slug,
			path: result.item.path,
			content: this.extractExcerpt(result.item.content, result.matches),
		}));
	}

	private extractExcerpt(content: string, matches: readonly Fuse.FuseResultMatch[] | undefined): string {
		if (!matches || matches.length === 0) {
			return content.slice(0, 200) + "...";
		}

		const match = matches[0];
		if (!match.indices || match.indices.length === 0) {
			return content.slice(0, 200) + "...";
		}

		const [start, end] = match.indices[0];
		const excerptStart = Math.max(0, start - 50);
		const excerptEnd = Math.min(content.length, end + 50);

		let excerpt = content.slice(excerptStart, excerptEnd);
		if (excerptStart > 0) excerpt = "..." + excerpt;
		if (excerptEnd < content.length) excerpt = excerpt + "...";

		return excerpt;
	}

	getIndexSize(): number {
		return this.index.length;
	}

	clearIndex(): void {
		this.index = [];
		this.fuse = null;
	}

	exportIndex(): SearchIndexItem[] {
		return [...this.index];
	}

	importIndex(items: SearchIndexItem[]): void {
		this.index = items;
		this.fuse = new Fuse(this.index, this.defaultOptions);
	}
}

export const searchEngine = new SearchEngine();
