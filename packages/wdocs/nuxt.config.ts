export default defineNuxtConfig({
	compatibilityDate: "2025-05-15",
	devtools: { enabled: true },

	modules: [
		"nuxt-mcp-dev",
		"@pinia/nuxt",
		"@unocss/nuxt",
		"@vueuse/nuxt",
		"@nuxtjs/color-mode",
		"@vue-macros/nuxt",
		"@nuxt/icon",
	],

	icon: {
		serverBundle: {
			collections: ["mdi"],
		},
	},

	nitro: {
		preset: "cloudflare_module",
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
		},
	},

	typescript: {
		typeCheck: false,
		strict: true,
	},

	app: {
		layoutTransition: { name: "layout", mode: "out-in" },
	},

	plugins: [
		"~/plugins/init.ts",
		"~/plugins/analytics.client.ts",
	],
});
