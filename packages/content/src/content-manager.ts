import { join } from "node:path";
import matter from "gray-matter";
import { MarkdownPipeline } from "./markdown-pipeline";
import { FrontmatterSchema, type PageData, type ContentItem, type NavItem, type Frontmatter } from "./types";

export interface ContentVersion {
	sha: string;
	date: string;
	message: string;
	author: string;
}

export interface IndexableDocument {
	id: string;
	title: string;
	content: string;
	path: string;
	frontmatter: Frontmatter;
}

export interface ContentMetadata {
	path: string;
	title: string;
	description?: string;
	lastModified: Date;
	versions: ContentVersion[];
}

export class ContentManager {
	private contentDir: string;
	private cache = new Map<string, PageData>();
	private markdownPipeline: MarkdownPipeline;

	constructor(contentDir: string = join(process.cwd(), "content"), markdownPipeline: MarkdownPipeline) {
		this.contentDir = contentDir;
		this.markdownPipeline = markdownPipeline;
	}

	async getAllContent(): Promise<ContentItem[]> {
		const glob = new Bun.Glob("**/*.md");
		const items: ContentItem[] = [];

		for await (const file of glob.scan(this.contentDir)) {
			const filePath = join(this.contentDir, file);
			const raw = await Bun.file(filePath).text();
			const { data } = matter(raw);

			const slug = `/${file.replace(/\\/g, "/").replace(/\.md$/, "")}`;

			items.push({
				title: (data?.title as string) || file,
				slug,
				path: slug,
				name: data?.name as string | undefined,
			});
		}

		return items;
	}

	async getContentBySlug(slug: string): Promise<PageData | null> {
		const normalizedSlug = slug.startsWith("/") ? slug.slice(1) : slug;
		const filePath = resolve(this.contentDir, `${normalizedSlug}.md`);

		try {
			const file = Bun.file(filePath);
			const fileExists = await file.exists();
			if (!fileExists) {
				return null;
			}

			const cacheKey = `${filePath}:${file.lastModified}`;

			if (this.cache.has(cacheKey)) {
				return this.cache.get(cacheKey)!;
			}

			const raw = await file.text();
			const { data, content } = matter(raw);

			const frontmatter = FrontmatterSchema.parse(data);
			const { html, toc } = await this.markdownPipeline.parse(content);

			const pageData: PageData = {
				slug,
				html,
				frontmatter,
				toc,
			};

			this.cache.set(cacheKey, pageData);

			return pageData;
		} catch (error) {
			console.error(`Failed to load content for slug: ${slug}`, error);
			return null;
		}
	}

	async getContentMetadata(slug: string): Promise<ContentMetadata | null> {
		const normalizedSlug = slug.startsWith("/") ? slug.slice(1) : slug;
		const filePath = join(this.contentDir, `${normalizedSlug}.md`);

		try {
			const file = Bun.file(filePath);
			const fileExists = await file.exists();
			if (!fileExists) {
				return null;
			}

			const raw = await file.text();
			const { data } = matter(raw);

			const frontmatter = FrontmatterSchema.parse(data);

			return {
				path: slug,
				title: frontmatter.title || slug,
				description: frontmatter.description,
				lastModified: new Date(file.lastModified),
				versions: await this.getContentVersions(filePath),
			};
		} catch (error) {
			console.error(`Failed to get metadata for slug: ${slug}`, error);
			return null;
		}
	}

	async getContentVersions(filePath: string): Promise<ContentVersion[]> {
		try {
			const { simpleGit } = await import("simple-git");
			const git = simpleGit();

			const log = await git.log({ file: filePath, maxCount: 10 });

			return log.all.map((commit) => ({
				sha: commit.hash,
				date: commit.date,
				message: commit.message,
				author: commit.author_name,
			}));
		} catch (error) {
			console.warn("Git not available for versioning:", error);
			return [];
		}
	}

	async getContentByVersion(filePath: string, sha: string): Promise<string | null> {
		try {
			const { simpleGit } = await import("simple-git");
			const git = simpleGit();

			const content = await git.show([`${sha}:${filePath}`]);
			return content;
		} catch (error) {
			console.error(`Failed to get content version ${sha} for ${filePath}:`, error);
			return null;
		}
	}

	async searchContent(query: string): Promise<ContentItem[]> {
		const allContent = await this.getAllContent();
		const lowerQuery = query.toLowerCase();

		return allContent.filter((item) =>
			item.title.toLowerCase().includes(lowerQuery) ||
			item.slug.toLowerCase().includes(lowerQuery)
		);
	}

	async getChildren(parentSlug: string): Promise<ContentItem[]> {
		const allContent = await this.getAllContent();
		const parentPath = parentSlug.endsWith("/") ? parentSlug : `${parentSlug}/`;

		return allContent.filter((item) =>
			item.slug.startsWith(parentPath) &&
			item.slug !== parentPath &&
			item.slug.split("/").length === parentPath.split("/").length + 1
		);
	}

	clearCache(): void {
		this.cache.clear();
	}

	async parseMarkdown(markdown: string): Promise<{ html: string; toc: any[] }> {
		return this.markdownPipeline.parse(markdown);
	}

	async rebuildIndex(): Promise<void> {
		this.clearCache();
		await this.getAllContent();
	}

	async getNavigation(): Promise<NavItem[]> {
		return this.buildNavTree();
	}

	async getAllDocumentsForIndexing(): Promise<IndexableDocument[]> {
		const glob = new Bun.Glob("**/*.md");
		const documents: IndexableDocument[] = [];

		for await (const file of glob.scan(this.contentDir)) {
			const filePath = join(this.contentDir, file);
			const raw = await Bun.file(filePath).text();
			const { data, content } = matter(raw);

			const docPath = `/${file.replace(/\\/g, "/").replace(/\.md$/, "")}`;

			let frontmatter;
			try {
				frontmatter = FrontmatterSchema.parse(data);
			} catch {
				console.warn(`Invalid frontmatter in ${file}, using raw data.`);
				frontmatter = data as Frontmatter;
			}

			documents.push({
				id: docPath,
				title: frontmatter.title ?? (data?.title as string | undefined) ?? file,
				content,
				path: docPath,
				frontmatter: frontmatter,
			});
		}

		return documents;
	}

	private async buildNavTree(): Promise<NavItem[]> {
		const glob = new Bun.Glob("**/*.{md,json}");
		const filesData: { path: string; data: any }[] = [];

		for await (const file of glob.scan(this.contentDir)) {
			const filePath = join(this.contentDir, file);
			const raw = await Bun.file(filePath).text();
			if (file.endsWith(".json")) {
				filesData.push({ path: file.split("/").slice(0, -1).join("/"), data: JSON.parse(raw) });
			} else {
				const { data } = matter(raw);
				filesData.push({ path: file, data });
			}
		}

		// A simplified tree construction logic. A more robust solution might be needed.
		const root: NavItem = { text: 'root', children: [] };
		const map = new Map<string, NavItem>();
		map.set('.', root);

		filesData.sort((a, b) => a.path.localeCompare(b.path));

		for (const { path, data } of filesData) {
			if (path.endsWith(".md")) {
				const parentPath = dirname(path);
				const parent = map.get(parentPath) ?? root;
				if (!parent.children) parent.children = [];
				parent.children.push({
					text: data.title || path,
					link: `/${path.replace(/\.md$/, "")}`,
				});
			} else { // config.json
				const parentPath = dirname(path);
				const parent = map.get(parentPath) ?? root;
				const self: NavItem = { text: data.title, order: data.order, children: [] };
				if (!parent.children) parent.children = [];
				parent.children.push(self);
				map.set(path, self);
			}
		}

		const sortChildren = (node: NavItem) => {
			if (node.children) {
				node.children.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
				node.children.forEach(sortChildren);
			}
		};

		sortChildren(root);

		return root.children ?? [];
	}
}
