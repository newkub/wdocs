import { defineConfig, presetTypography, presetWind4 } from "unocss";


export default defineConfig({
	presets: [
		presetWind4({
			dark: "class",
			preflights: {
				reset: true,
			},
		}),
		presetTypography(),
	],
});
