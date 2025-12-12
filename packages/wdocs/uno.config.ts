import { defineConfig, presetIcons, presetTypography, presetWind4 } from "unocss";

export default defineConfig({
	presets: [
		presetWind4({
			preflights: {
				reset: true,
			},
		}),
		presetIcons({
			collections: {
				mdi: () => import("@iconify-json/mdi/icons.json").then(i => i.default),
				"heroicons-outline": () => import("@iconify-json/heroicons-outline/icons.json").then(i => i.default),
			},
		}),
		presetTypography(),
	],
	shortcuts: {
		// Layout
		"flex-center": "flex items-center justify-center",
		"flex-between": "flex items-center justify-between",

		// Components
		"card": "p-4 rounded-lg shadow bg-white",
		"btn": "px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50",
		"input": "px-4 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none",

		// States
		"link": "text-blue-500 hover:text-blue-600 hover:underline",
	},
});
