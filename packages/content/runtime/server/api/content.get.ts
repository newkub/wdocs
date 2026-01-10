import { join } from "node:path";
import matter from "gray-matter";

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig().public.wdocsContent;
	const contentDir = join(process.cwd(), config.contentDir || "content");
	const glob = new Bun.Glob("**/*.md");

	const items: Array<{ title: string; slug: string; path: string; name?: string }> = [];

	for await (const file of glob.scan(contentDir)) {
		const filePath = join(contentDir, file);
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
});
