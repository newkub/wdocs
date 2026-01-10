import { computed } from "vue";
import { useRoute } from "vue-router";
import type { PageContent, PageData } from "../../shared/types";

import type { Ref } from "vue";

export function usePageData(contents: Ref<PageContent[] | null | undefined>): {
	page: Ref<PageData | undefined>;
	editPageUrl: Ref<string | null>;
	lastUpdated: Ref<string | null>;
} {
	const { wdocs } = useAppConfig();
	const route = useRoute();

	const page = computed<PageData | undefined>(() => {
		const content = contents.value?.find((item) => item.path === route.path);
		if (!content) return undefined;

		// Transform PageContent to PageData
		const { title, description, ...rest } = content;
		return {
			slug: content.slug,
			html: content.html,
			toc: content.toc,
			frontmatter: {
				title,
				description,
				...rest,
			},
		};
	});

	const editPageUrl = computed(() => {
		const content = contents.value?.find((item) => item.path === route.path);
		if (!wdocs.editPage?.repo || !content?.sourcePath) return null;
		const { repo, branch, dir } = wdocs.editPage;
		return `${repo}/edit/${branch}/${dir ? `${dir}/` : ""}${content.sourcePath}`;
	});

	const lastUpdated = computed(() => {
		const content = contents.value?.find((item) => item.path === route.path);
		if (!content?.lastUpdated) return null;
		return new Date(content.lastUpdated).toLocaleDateString();
	});

	return { page, editPageUrl, lastUpdated };
}
