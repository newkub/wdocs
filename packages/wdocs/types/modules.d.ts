declare module "markdown-it-include";
declare module "markdown-it-mermaid";
declare module "markdown-it-container";
declare module "search" {
	interface SearchDocument {
		title: string;
		slug: string;
		path: string;
		content: string;
	}

	interface SearchResult {
		title: string;
		slug: string;
		path: string;
		score?: number;
	}

	export class NapiIndex {
		constructor();
		addDocuments(documents: SearchDocument[]): void;
		buildIndex(): void;
		search(query: string): SearchResult[];
	}
}

declare module "@nuxt/schema" {
	interface NuxtConfig {
		wdocs?: {
			name?: string;
			description?: string;
			sidebar?: Record<string, unknown>;
			editPage?: {
				repo: string;
				branch: string;
				dir: string;
				text: string;
			};
			title?: string;
			description?: string;
			socials?: Record<string, string>;
			header?: {
				nav: unknown[];
				logo?: boolean;
			};
			footer?: {
				message?: string;
				copyright?: string;
			};
			theme?: Record<string, string>;
		};
	}
}
