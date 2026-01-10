import { join } from "node:path";
import matter from "gray-matter";
import { NapiIndex } from "search";

let searchIndex: NapiIndex | null = null;

async function getOrCreateIndex(): Promise<NapiIndex> {
	if (searchIndex) {
		return searchIndex;
	}

	const index = new NapiIndex();
	const contentDir = join(process.cwd(), "content");
	const glob = new Bun.Glob("**/*.md");

	const documents = [];
	for await (const file of glob.scan(contentDir)) {
		const filePath = join(contentDir, file);
		const content = await Bun.file(filePath).text();
		const { data, content: body } = matter(content);

		documents.push({
			fields: {
				title: data.title || "",
				content: body,
				path: `/docs/${file.replace(/\.md$/, "")}`,
			},
		});
	}

	index.addDocuments(documents);
	index.buildIndex();

	searchIndex = index;
	return index;
}

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const searchTerm = query.q as string;

	if (!searchTerm) {
		return [];
	}

	try {
		const index = await getOrCreateIndex();
		const results = index.search(searchTerm, 10);

		return results.map((result: any) => ({
			title: result.fields.title,
			slug: result.fields.path,
			path: result.fields.path,
			content: result.fields.content.slice(0, 200),
			score: result.score,
		}));
	} catch (error) {
		console.error("Search failed", error);
		return [];
	}
});
