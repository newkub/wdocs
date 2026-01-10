import { join } from "node:path";
import matter from "gray-matter";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const searchTerm = (query.q as string)?.toLowerCase();
	if (!searchTerm) {
		return [];
	}

	const config = useRuntimeConfig().public.wdocsContent;
	const contentDir = join(process.cwd(), config.contentDir || "content");
	const glob = new Bun.Glob("**/*.md");

	const results: Array<{ title: string; slug: string; path: string; name?: string }> = [];

	for await (const file of glob.scan(contentDir)) {
		const filePath = join(contentDir, file);
		const raw = await Bun.file(filePath).text();
		const { data, content } = matter(raw);

		const slug = `/${file.replace(/\\/g, "/").replace(/\.md$/, "")}`;
		const title = (data?.title as string) || file;

		if (title.toLowerCase().includes(searchTerm) ||
			slug.toLowerCase().includes(searchTerm) ||
			content.toLowerCase().includes(searchTerm)) {
			results.push({
				title,
				slug,
				path: slug,
				name: data?.name as string | undefined,
			});
		}
	}

	return results;
});
