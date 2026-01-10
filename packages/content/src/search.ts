import matter from "gray-matter";
import { join } from "node:path";
import { NapiIndex } from "search";

let searchIndex: null | NapiIndex = null;

async function createSearchIndex() {
	console.log("Creating search index...");
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

	console.log(`Search index created with ${documents.length} documents.`);
	return index;
}

// Initialize the index on server startup
if (process.env.NODE_ENV !== "development" || process.env.NITRO_PRERENDER) {
	void createSearchIndex().then((index) => {
		searchIndex = index;
	});
} else {
	// In development, we can delay the index creation
	setTimeout(() => {
		void createSearchIndex().then((index) => {
			searchIndex = index;
		});
	}, 1000);
}

export { searchIndex };
