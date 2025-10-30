import Sonda from "sonda/nuxt";
import { checker } from "vite-plugin-checker";
import type { PluginOption } from 'vite';

export default defineNuxtConfig({

	compatibilityDate: "2025-07-15",

	css: [
		"@unocss/reset/tailwind-compat.css",
		"./theme.css",
	],
	devtools: {
		enabled: true,
	},
	imports: {
		autoImport: false
	},
	components: {
		global: false,
		dirs: []
	},
	modules: [
		"@unocss/nuxt",
		"@vueuse/nuxt",
		"@nuxtjs/color-mode",
		"nuxt-auth-utils",
		Sonda({
			open: true,
			server: false,
		}),
		"@nuxt/test-utils/module",
	],
	nitro: {
		preset: "cloudflare",
	},
	colorMode: {
		classPrefix: "",
		classSuffix: "",
		componentName: "ColorScheme",
		fallback: "light",
		globalName: "__NUXT_COLOR_MODE__",
		hid: "nuxt-color-mode-script",
		preference: "system",
		storage: "localStorage",
		storageKey: "nuxt-color-mode",
	},
	routeRules: {
		// Render all admin routes on the client-side
		"/admin/**": { ssr: false },

		// Example of a redirect
		"/old-page": { redirect: { statusCode: 301, to: "/" } },
	},

	runtimeConfig: {
		workosApiKey: "",
		workosClientId: "",
	},
	typescript: {
		strict: true,
	},
	vite: {
		plugins: [
			checker({
				overlay: {
					initialIsOpen: false,
				},
				typescript: true,
				vueTsc: true,
			}) as PluginOption,
		],
	},
});
