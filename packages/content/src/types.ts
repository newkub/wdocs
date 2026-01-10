import { z } from "zod";

export type NavItem = {
	text: string;
	link?: string;
	children?: NavItem[];
	items?: NavItem[];
	method?: string;
	name?: string;
	order?: number;
	icon?: string;
};

export const NavItemSchema: z.ZodType<NavItem> = z.object({
	text: z.string(),
	link: z.string().optional(),
	children: z.array(z.lazy(() => NavItemSchema)).optional(),
	items: z.array(z.lazy(() => NavItemSchema)).optional(),
	method: z.string().optional(),
	name: z.string().optional(),
	order: z.number().optional(),
	icon: z.string().optional(),
});

export const FrontmatterSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	api: z.boolean().optional(),
	method: z.string().optional(),
	path: z.string().optional(),
	// Sidebar icon
	icon: z.string().optional(),
	// Page header cover image
	cover: z.string().optional(),
	// SEO
	favicon: z.string().optional(),
	"og:title": z.string().optional(),
	"og:description": z.string().optional(),
	"og:image": z.string().optional(),
	"twitter:card": z
		.enum(["summary", "summary_large_image", "app", "player"])
		.optional(),
	"twitter:creator": z.string().optional(),
});
export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export const HeadingSchema = z.object({
	title: z.string(),
	slug: z.string(),
	depth: z.number(),
	level: z.number(),
});
export type Heading = z.infer<typeof HeadingSchema>;

export const PageDataSchema = z.object({
	slug: z.string(),
	html: z.string(),
	frontmatter: FrontmatterSchema,
	toc: z.array(HeadingSchema),
});
export type PageData = z.infer<typeof PageDataSchema>;

export type ContentItem = {
	title: string;
	slug: string;
	path: string;
	children?: ContentItem[];
	name?: string;
};

export const ContentItemSchema: z.ZodType<ContentItem> = z.object({
	title: z.string(),
	slug: z.string(),
	path: z.string(),
	children: z.array(z.lazy(() => ContentItemSchema)).optional(),
	name: z.string().optional(),
});

export const MarkdownApiResponseSchema = z.object({
	html: z.string(),
	toc: z.array(HeadingSchema),
});
export type MarkdownApiResponse = z.infer<typeof MarkdownApiResponseSchema>;

export const PageContentSchema = z.object({
	title: z.string(),
	html: z.string(),
	toc: z.array(HeadingSchema),
	slug: z.string(),
	path: z.string(),
	image: z.string().optional(),
	favicon: z.string().optional(),
	description: z.string().optional(),
	"og:title": z.string().optional(),
	"og:description": z.string().optional(),
	"og:type": z.string().optional(),
	"twitter:card": z
		.enum(["summary", "summary_large_image", "app", "player"])
		.optional(),
	"twitter:creator": z.string().optional(),
	sourcePath: z.string().optional(),
	lastUpdated: z.string().optional(),
});
export type PageContent = z.infer<typeof PageContentSchema>;

export const SearchResultSchema = z.object({
	title: z.string(),
	slug: z.string(),
	path: z.string(),
	content: z.string(),
});
export type SearchResult = z.infer<typeof SearchResultSchema>;
