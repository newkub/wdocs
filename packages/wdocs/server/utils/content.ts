import { ContentManager, MarkdownCache, MarkdownPipeline } from '@wdocs/content';
import { createHighlighter } from 'shiki';
import {
	createAnchorTransformer,
	createCodeCopyTransformer,
	createContainerTransformer,
	createHighlighterTransformer,
	createIncludeTransformer,
	createMermaidTransformer,
} from '@wdocs/content';

const cache = new MarkdownCache();
const pipeline = new MarkdownPipeline(cache);

// Initialize pipeline with transformers
async function initializePipeline() {
	const highlighter = await createHighlighter({
		themes: ['vitesse-light', 'vitesse-dark'],
		langs: ['javascript', 'typescript', 'vue', 'rust', 'json', 'shell'],
	});

	pipeline.addTransformers([
		createHighlighterTransformer(highlighter),
		createAnchorTransformer(),
		createContainerTransformer('info'),
		createContainerTransformer('tip'),
		createContainerTransformer('warning'),
		createIncludeTransformer(process.cwd()),
		createMermaidTransformer(),
		createCodeCopyTransformer(),
	]);
}

initializePipeline();

export const contentManager = new ContentManager(undefined, pipeline);
