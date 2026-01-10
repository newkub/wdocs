import type { PageData } from "~/shared/types";

export function usePageLifecycle(pageData: Ref<null | PageData>) {
	const { wdocs } = useAppConfig();

	const editPageUrl = computed(() => {
		if (!wdocs.editPage || !pageData.value?.sourcePath) return null;
		const { repo, branch, dir } = wdocs.editPage;
		return `${repo}/edit/${branch}/${dir}/${pageData.value.sourcePath}`;
	});

	const lastUpdated = computed(() => {
		if (!pageData.value?.lastUpdated) return null;
		return new Date(pageData.value.lastUpdated).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	});

	return { editPageUrl, lastUpdated };
}
