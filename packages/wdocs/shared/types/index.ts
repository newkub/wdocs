import { z } from 'zod'

export type NavItem = {
  text: string
  link: string
  children?: NavItem[]
  method?: string
  name?: string
  order?: number
}

export const NavItemSchema: z.ZodType<NavItem> = z.object({
  text: z.string(),
  link: z.string(),
  children: z.array(z.lazy(() => NavItemSchema)).optional(),
  method: z.string().optional(),
  name: z.string().optional(),
  order: z.number().optional(),
})

export const ApiParameterSchema = z.object({
  name: z.string(),
  in: z.enum(['query', 'header', 'path', 'cookie']),
  description: z.string(),
  required: z.boolean().optional(),
  schema: z.object({
    type: z.string(),
    default: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
  }),
})
export type ApiParameter = z.infer<typeof ApiParameterSchema>

export const ApiResponseSchema = z.object({
  description: z.string(),
})
export type ApiResponse = z.infer<typeof ApiResponseSchema>

export const FrontmatterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  api: z.boolean().optional(),
  method: z.string().optional(),
  path: z.string().optional(),
  parameters: z.array(ApiParameterSchema).optional(),
  responses: z.record(z.string(), ApiResponseSchema).optional(),
})
export type Frontmatter = z.infer<typeof FrontmatterSchema>

export const HeadingSchema = z.object({
  title: z.string(),
  slug: z.string(),
  depth: z.number(),
  level: z.number(),
})
export type Heading = z.infer<typeof HeadingSchema>

export const PageDataSchema = z.object({
  slug: z.string(),
  html: z.string(),
  frontmatter: FrontmatterSchema,
  toc: z.array(HeadingSchema),
})
export type PageData = z.infer<typeof PageDataSchema>

export const WDocsConfigSchema = z.object({
  sidebar: z.record(z.string(), z.any()),
  editPage: z.object({ repo: z.string(), branch: z.string(), dir: z.string(), text: z.string() }).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  socials: z.record(z.string(), z.string()).optional(),
  header: z.object({ nav: z.array(NavItemSchema), logo: z.boolean().optional() }).optional(),
  footer: z.object({ message: z.string().optional(), copyright: z.string().optional() }).optional(),
  theme: z.record(z.string(), z.string()).optional(),
})
export type WDocsConfig = z.infer<typeof WDocsConfigSchema>

export type ContentItem = {
  title: string
  slug: string
  path: string
  children?: ContentItem[]
  name?: string
}

export const ContentItemSchema: z.ZodType<ContentItem> = z.object({
  title: z.string(),
  slug: z.string(),
  path: z.string(),
  children: z.array(z.lazy(() => ContentItemSchema)).optional(),
  name: z.string().optional(),
})


export const MarkdownApiResponseSchema = z.object({
  html: z.string(),
  toc: z.array(HeadingSchema),
})
export type MarkdownApiResponse = z.infer<typeof MarkdownApiResponseSchema>

export const PageContentSchema = z.object({
  title: z.string(),
  html: z.string(),
  toc: z.array(HeadingSchema),
  slug: z.string(),
  path: z.string(),
  image: z.string().optional(),
  favicon: z.string().optional(),
  description: z.string().optional(),
  'og:title': z.string().optional(),
  'og:description': z.string().optional(),
  'og:type': z.string().optional(),
  'twitter:card': z.enum(['summary', 'summary_large_image', 'app', 'player']).optional(),
  'twitter:creator': z.string().optional(),
  sourcePath: z.string().optional(),
  lastUpdated: z.string().optional(),
})
export type PageContent = z.infer<typeof PageContentSchema>

export const SearchResultSchema = z.object({
  title: z.string(),
  slug: z.string(),
  path: z.string(),
  content: z.string(),
})
export type SearchResult = z.infer<typeof SearchResultSchema>
