export const useThemes = () => {
	const colorMode = useColorMode();

	const themes = [
		{ name: "light", icon: "mdi:white-balance-sunny" },
		{ name: "dark", icon: "mdi:weather-night" },
	];

	const toggleTheme = () => {
		colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
	};

	const currentIcon = computed(() => {
		const darkIcon = themes[1]?.icon || "";
		const lightIcon = themes[0]?.icon || "";
		return colorMode.value === "dark" ? darkIcon : lightIcon;
	});

	return {
		toggleTheme,
		currentIcon,
	};
};
