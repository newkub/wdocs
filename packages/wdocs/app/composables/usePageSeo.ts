import { useHead, useSeoMeta } from "#imports";
import { computed } from "vue";
import type { PageData } from "../../shared/types";

export const usePageSeo = (page: Ref<PageData | null | undefined>) => {
	const { wdocs = {} } = useAppConfig();

	const siteName = computed(() => wdocs.title || "WDocs");
	const defaultDescription = computed(
		() => wdocs.description || "A documentation site.",
	);
	const _defaultImage = "/og-image.png";

	const title = computed(
		() => page.value?.frontmatter?.title || siteName.value,
	);
	const favicon = computed(
		() => page.value?.frontmatter?.favicon || "/favicon.ico",
	);

	useHead({
		title,
		link: [
			{
				rel: "icon",
				type: "image/x-icon",
				href: favicon,
			},
		],
	});

	useSeoMeta({
		title: title.value,
		description: page.value?.frontmatter?.description || defaultDescription.value,
		ogTitle: page.value?.frontmatter?.["og:title"] || title.value,
		ogDescription: page.value?.frontmatter?.["og:description"]
			|| page.value?.frontmatter?.description
			|| defaultDescription.value,
		twitterCard: page.value?.frontmatter?.["twitter:card"] || "summary_large_image",
		twitterCreator: page.value?.frontmatter?.["twitter:creator"] || "",
	});
};
