import { addImportsDir, addPlugin, createResolver, defineNuxtModule } from "@nuxt/kit";

export interface WDocsContentModuleOptions {
	contentDir?: string;
	enableSearch?: boolean;
	enableMermaid?: boolean;
	enableCopyCode?: boolean;
	enableGitVersioning?: boolean;
	customTransformers?: string[];
	cacheTTL?: number;
}

export default defineNuxtModule<WDocsContentModuleOptions>({
	meta: {
		name: "@wdocs/content",
		configKey: "wdocsContent",
		version: "0.1.0",
	},
	defaults: {
		contentDir: "content",
		enableSearch: true,
		enableMermaid: true,
		enableCopyCode: true,
		enableGitVersioning: true,
		customTransformers: [],
		cacheTTL: 5 * 60 * 1000,
	},
	async setup(options: WDocsContentModuleOptions, nuxt: any) {
		const resolver = createResolver(import.meta.url);

		nuxt.options.alias = {
			...nuxt.options.alias,
			"~wdocs/content": resolver.resolve("./runtime"),
			"~wdocs/content/*": resolver.resolve("./runtime/*"),
		};

		nuxt.options.runtimeConfig.public.wdocsContent = options;

		addPlugin(resolver.resolve("./runtime/plugins/content"));
		addPlugin(resolver.resolve("./runtime/plugins/markdown"));

		if (options.enableCopyCode) {
			addPlugin(resolver.resolve("./runtime/plugins/copy-code.client"));
		}

		if (options.enableMermaid) {
			addPlugin(resolver.resolve("./runtime/plugins/mermaid.client"));
		}

		addImportsDir(resolver.resolve("./runtime/composables"));

		nuxt.hook("app:rendered", (context) => {
			if (process.env.NODE_ENV === "development") {
				console.log("@wdocs/content: App rendered", context.ssrContext?.url);
			}
		});

		nuxt.hook("build:done", () => {
			console.log("@wdocs/content: Build completed successfully");
		});
	},
});
