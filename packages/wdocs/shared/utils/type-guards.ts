import type {
	ApiParameter,
	ApiResponse,
	ContentItem,
	Frontmatter,
	Heading,
	NavItem,
	PageData,
	WDocsConfig,
} from "../types";

export function isFrontmatter(data: unknown): data is Frontmatter {
	return (
		typeof data === "object"
		&& data !== null
		&& ("title" in data ? typeof data.title === "string" || data.title === undefined : true)
		&& ("description" in data ? typeof data.description === "string" || data.description === undefined : true)
		&& ("api" in data ? typeof data.api === "boolean" || data.api === undefined : true)
		&& ("method" in data ? typeof data.method === "string" || data.method === undefined : true)
		&& ("path" in data ? typeof data.path === "string" || data.path === undefined : true)
		&& ("icon" in data ? typeof data.icon === "string" || data.icon === undefined : true)
		&& ("cover" in data ? typeof data.cover === "string" || data.cover === undefined : true)
	);
}

export function isPageData(data: unknown): data is PageData {
	return (
		typeof data === "object"
		&& data !== null
		&& "slug" in data
		&& typeof data.slug === "string"
		&& "html" in data
		&& typeof data.html === "string"
		&& "frontmatter" in data
		&& "toc" in data
		&& Array.isArray(data.toc)
	);
}

export function isWDocsConfig(data: unknown): data is WDocsConfig {
	return (
		typeof data === "object"
		&& data !== null
		&& ("title" in data ? typeof data.title === "string" || data.title === undefined : true)
		&& ("description" in data ? typeof data.description === "string" || data.description === undefined : true)
		&& "sidebar" in data
		&& typeof data.sidebar === "object"
		&& data.sidebar !== null
	);
}

export function isNavItem(data: unknown): data is NavItem {
	return (
		typeof data === "object"
		&& data !== null
		&& "text" in data
		&& typeof data.text === "string"
		&& ("link" in data ? typeof data.link === "string" || data.link === undefined : true)
		&& ("icon" in data ? typeof data.icon === "string" || data.icon === undefined : true)
		&& ("order" in data ? typeof data.order === "number" || data.order === undefined : true)
	);
}

export function isContentItem(data: unknown): data is ContentItem {
	return (
		typeof data === "object"
		&& data !== null
		&& "title" in data
		&& typeof data.title === "string"
		&& "slug" in data
		&& typeof data.slug === "string"
		&& "path" in data
		&& typeof data.path === "string"
	);
}

export function isHeading(data: unknown): data is Heading {
	return (
		typeof data === "object"
		&& data !== null
		&& "title" in data
		&& typeof data.title === "string"
		&& "slug" in data
		&& typeof data.slug === "string"
		&& "depth" in data
		&& typeof data.depth === "number"
		&& "level" in data
		&& typeof data.level === "number"
	);
}

export function isApiParameter(data: unknown): data is ApiParameter {
	return (
		typeof data === "object"
		&& data !== null
		&& "name" in data
		&& typeof data.name === "string"
		&& "in" in data
		&& typeof data.in === "string"
		&& ["query", "header", "path", "cookie"].includes(data.in)
		&& "description" in data
		&& typeof data.description === "string"
		&& "schema" in data
		&& typeof data.schema === "object"
		&& data.schema !== null
		&& "type" in data.schema
		&& typeof data.schema.type === "string"
	);
}

export function isApiResponse(data: unknown): data is ApiResponse {
	return (
		typeof data === "object"
		&& data !== null
		&& "description" in data
		&& typeof data.description === "string"
	);
}

export function isString(value: unknown): value is string {
	return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
	return typeof value === "number" && !Number.isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
	return typeof value === "boolean";
}

export function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isArray(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

export function assertFrontmatter(data: unknown): asserts data is Frontmatter {
	if (!isFrontmatter(data)) {
		throw new Error("Expected Frontmatter");
	}
}

export function assertPageData(data: unknown): asserts data is PageData {
	if (!isPageData(data)) {
		throw new Error("Expected PageData");
	}
}

export function assertWDocsConfig(data: unknown): asserts data is WDocsConfig {
	if (!isWDocsConfig(data)) {
		throw new Error("Expected WDocsConfig");
	}
}

export function assertNavItem(data: unknown): asserts data is NavItem {
	if (!isNavItem(data)) {
		throw new Error("Expected NavItem");
	}
}

export function assertContentItem(data: unknown): asserts data is ContentItem {
	if (!isContentItem(data)) {
		throw new Error("Expected ContentItem");
	}
}

export function assertHeading(data: unknown): asserts data is Heading {
	if (!isHeading(data)) {
		throw new Error("Expected Heading");
	}
}

export function assertApiParameter(data: unknown): asserts data is ApiParameter {
	if (!isApiParameter(data)) {
		throw new Error("Expected ApiParameter");
	}
}

export function assertApiResponse(data: unknown): asserts data is ApiResponse {
	if (!isApiResponse(data)) {
		throw new Error("Expected ApiResponse");
	}
}
