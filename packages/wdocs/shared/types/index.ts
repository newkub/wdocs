import { z } from "zod";

export type {
	Frontmatter,
	Heading,
	PageData,
	ContentItem,
	MarkdownApiResponse,
	PageContent,
	SearchResult,
} from "@wdocs/content";

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

export const ApiParameterSchema = z.object({
	name: z.string(),
	in: z.enum(["query", "header", "path", "cookie"]),
	description: z.string(),
	required: z.boolean().optional(),
	schema: z.object({
		type: z.string(),
		default: z
			.union([z.string(), z.number(), z.boolean(), z.null()])
			.optional(),
	}),
});
export type ApiParameter = z.infer<typeof ApiParameterSchema>;

export const ApiResponseSchema = z.object({
	description: z.string(),
});
export type ApiResponse = z.infer<typeof ApiResponseSchema>;

export const WDocsConfigSchema = z.object({
	sidebar: z.record(z.string(), z.any()),
	editPage: z
		.object({
			repo: z.string(),
			branch: z.string(),
			dir: z.string(),
			text: z.string(),
		})
		.optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	socials: z.record(z.string(), z.string()).optional(),
	header: z
		.object({
			nav: z.array(z.lazy(() => NavItemSchema)),
			logo: z.boolean().optional(),
		})
		.optional(),
	footer: z
		.object({
			message: z.string().optional(),
			copyright: z.string().optional(),
		})
		.optional(),
	theme: z.record(z.string(), z.string()).optional(),
});
export type WDocsConfig = z.infer<typeof WDocsConfigSchema>;

declare module "nuxt/schema" {
	interface AppConfig {
		wdocs?: WDocsConfig;
	}
}
