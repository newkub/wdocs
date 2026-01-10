import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
	if (import.meta.client) {
		import("mermaid").then((mermaid) => {
			mermaid.default.initialize({
				startOnLoad: true,
				theme: "default",
			});
		});
	}
});
