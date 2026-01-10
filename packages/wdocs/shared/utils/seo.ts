import type { PageContent, Frontmatter } from "../../shared/types";

export interface SeoMetadata {
	title: string;
	description: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	ogType?: string;
	twitterCard?: "summary" | "summary_large_image" | "app" | "player";
	twitterCreator?: string;
	canonical?: string;
	noindex?: boolean;
	nofollow?: boolean;
}

export interface StructuredData {
	"@context": string;
	"@type": string;
	[key: string]: unknown;
}

export class SeoManager {
	generateMetadata(frontmatter: Frontmatter, baseUrl: string, path: string): SeoMetadata {
		const title = frontmatter.title || "WDocs";
		const description = frontmatter.description || "A VitePress-like documentation system built with Nuxt.";

		return {
			title,
			description,
			ogTitle: frontmatter["og:title"] || title,
			ogDescription: frontmatter["og:description"] || description,
			ogImage: frontmatter["og:image"],
			ogType: "website",
			twitterCard: frontmatter["twitter:card"] || "summary",
			twitterCreator: frontmatter["twitter:creator"],
			canonical: `${baseUrl}${path}`,
		};
	}

	generateJsonLd(page: PageContent, baseUrl: string): StructuredData {
		return {
			"@context": "https://schema.org",
			"@type": "Article",
			headline: page.title,
			description: page.description,
			url: `${baseUrl}${page.path}`,
			datePublished: page.lastUpdated,
			dateModified: page.lastUpdated,
			author: {
				"@type": "Organization",
				name: "WDocs",
			},
			publisher: {
				"@type": "Organization",
				name: "WDocs",
				logo: {
					"@type": "ImageObject",
					url: `${baseUrl}/logo.png`,
				},
			},
		};
	}

	generateBreadcrumbJsonLd(breadcrumbs: Array<{ title: string; link: string }>, baseUrl: string): StructuredData {
		return {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: breadcrumbs.map((item, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: item.title,
				item: `${baseUrl}${item.link}`,
			})),
		};
	}

	generateSitemap(pages: Array<{ path: string; lastModified: Date }>, baseUrl: string): string {
		const urls = pages.map((page) => {
			const lastmod = page.lastModified.toISOString().split("T")[0];
			return `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
		}).join("\n");

		return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
	}

	generateRobotsTxt(baseUrl: string, disallowPaths: string[] = []): string {
		const disallow = disallowPaths.map((path) => `Disallow: ${path}`).join("\n");

		return `User-agent: *
Allow: /
${disallow}

Sitemap: ${baseUrl}/sitemap.xml`;
	}

	injectMetaTags(metadata: SeoMetadata): Array<{ name: string; content: string } | { property: string; content: string }> {
		const tags: Array<{ name: string; content: string } | { property: string; content: string }> = [
			{ name: "title", content: metadata.title },
			{ name: "description", content: metadata.description },
		];

		if (metadata.ogTitle) {
			tags.push({ property: "og:title", content: metadata.ogTitle });
		}

		if (metadata.ogDescription) {
			tags.push({ property: "og:description", content: metadata.ogDescription });
		}

		if (metadata.ogImage) {
			tags.push({ property: "og:image", content: metadata.ogImage });
		}

		if (metadata.ogType) {
			tags.push({ property: "og:type", content: metadata.ogType });
		}

		if (metadata.twitterCard) {
			tags.push({ name: "twitter:card", content: metadata.twitterCard });
		}

		if (metadata.twitterCreator) {
			tags.push({ name: "twitter:creator", content: metadata.twitterCreator });
		}

		if (metadata.canonical) {
			tags.push({ name: "canonical", content: metadata.canonical });
		}

		if (metadata.noindex) {
			tags.push({ name: "robots", content: "noindex" });
		}

		if (metadata.nofollow) {
			tags.push({ name: "robots", content: "nofollow" });
		}

		return tags;
	}

	extractKeywords(content: string, maxKeywords: number = 10): string[] {
		const words = content
			.toLowerCase()
			.replace(/[^\w\s]/g, "")
			.split(/\s+/)
			.filter((word) => word.length > 3);

		const stopWords = new Set(["this", "that", "with", "from", "have", "will", "been", "were", "they", "what", "when", "where", "which", "their", "there", "would", "could", "should"]);

		const frequency = new Map<string, number>();

		for (const word of words) {
			if (!stopWords.has(word)) {
				frequency.set(word, (frequency.get(word) || 0) + 1);
			}
		}

		return Array.from(frequency.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, maxKeywords)
			.map(([word]) => word);
	}
}

export const seoManager = new SeoManager();
