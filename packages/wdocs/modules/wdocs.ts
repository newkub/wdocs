import { addComponent, addComponentsDir, addImportsDir, addPlugin, createResolver, defineNuxtModule } from "@nuxt/kit";
import { fileURLToPath } from "node:url";
import type { WDocsConfig } from "../shared/types";
import { validateWDocsConfig } from "../shared/utils/validation";

export interface WDocsModuleOptions extends Partial<WDocsConfig> {
	enableSearch?: boolean;
	enableMermaid?: boolean;
	enableCopyCode?: boolean;
	enableThemeToggle?: boolean;
	customPlugins?: string[];
	customComponents?: string[];
}

export default defineNuxtModule<WDocsModuleOptions>({
	meta: {
		name: "wdocs",
		configKey: "wdocs",
		version: "0.1.0",
	},
	defaults: {
		enableSearch: true,
		enableMermaid: true,
		enableCopyCode: true,
		enableThemeToggle: true,
		customPlugins: [],
		customComponents: [],
	},
	async setup(options, nuxt) {
		const resolver = createResolver(import.meta.url);
		const rootResolver = createResolver(fileURLToPath(new URL("../", import.meta.url)));

		nuxt.options.alias = {
			...nuxt.options.alias,
			"~wdocs": rootResolver.resolve(),
			"~wdocs/*": rootResolver.resolve("*"),
		};

		nuxt.options.runtimeConfig.public.wdocs = options;

		try {
			validateWDocsConfig(options);
		} catch (error) {
			console.warn("WDocs config validation warning:", error);
		}

		if (options.enableCopyCode !== false) {
			addPlugin(resolver.resolve("../app/plugins/copy-code.client"));
		}

		if (options.enableMermaid !== false) {
			addPlugin(resolver.resolve("../app/plugins/mermaid.client"));
		}

		addPlugin(resolver.resolve("../app/plugins/theme"));

		if (options.customPlugins && options.customPlugins.length > 0) {
			for (const plugin of options.customPlugins) {
				addPlugin(plugin);
			}
		}

		addComponentsDir({
			path: resolver.resolve("../app/components"),
			prefix: "",
			global: true,
		});

		if (options.customComponents && options.customComponents.length > 0) {
			for (const component of options.customComponents) {
				addComponent({
					name: component,
					filePath: component,
				});
			}
		}

		addImportsDir(resolver.resolve("../app/composables"));

		nuxt.hook("app:rendered", (context) => {
			if (process.env.NODE_ENV === "development") {
				console.log("WDocs: App rendered", context.ssrContext?.url);
			}
		});

		nuxt.hook("build:done", () => {
			console.log("WDocs: Build completed successfully");
		});

		nuxt.hook("pages:extend", (pages) => {
			console.log(`WDocs: ${pages.length} pages registered`);
		});
	},
});
