import { useState } from "#imports";
import { onMounted, onUnmounted } from "vue";
import type { Heading } from "~/shared/types";

export function useTableOfContents(headings: Ref<Heading[]>) {
	const tocHeadings = useState<Heading[]>("toc-headings", () => []);
	const activeHeadingSlug = useState<string | null>(
		"toc-active-heading",
		() => null,
	);

	// Update the shared state when the page's headings change
	watch(
		headings,
		(newHeadings) => {
			tocHeadings.value = newHeadings || [];
		},
		{ immediate: true },
	);

	// Logic to track active heading based on scroll position
	onMounted(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const slug = entry.target.id;
						if (slug) {
							activeHeadingSlug.value = slug;
							return;
						}
					}
				}
			},
			{
				rootMargin: "0px 0px -80% 0px",
				threshold: 1,
			},
		);

		document.querySelectorAll("h2[id], h3[id]").forEach((el) => {
			observer.observe(el);
		});

		onUnmounted(() => {
			observer.disconnect();
			// Clear state on page leave
			tocHeadings.value = [];
			activeHeadingSlug.value = null;
		});
	});

	return { headings: tocHeadings, activeHeadingSlug };
}
