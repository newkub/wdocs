export type ThemeMode = "light" | "dark" | "system";

export interface ThemePreset {
	name: string;
	primary: string;
	background: string;
	foreground: string;
	border: string;
	card: string;
	cardForeground: string;
	popover: string;
	popoverForeground: string;
	muted: string;
	mutedForeground: string;
	accent: string;
	accentForeground: string;
	destructive: string;
	destructiveForeground: string;
	ring: string;
}

export const themePresets: Record<string, ThemePreset> = {
	default: {
		name: "Default",
		primary: "#007bff",
		background: "#ffffff",
		foreground: "#1a1a1a",
		border: "#e5e7eb",
		card: "#ffffff",
		cardForeground: "#1a1a1a",
		popover: "#ffffff",
		popoverForeground: "#1a1a1a",
		muted: "#f3f4f6",
		mutedForeground: "#6b7280",
		accent: "#007bff",
		accentForeground: "#ffffff",
		destructive: "#ef4444",
		destructiveForeground: "#ffffff",
		ring: "#007bff",
	},
	dark: {
		name: "Dark",
		primary: "#3b82f6",
		background: "#0a0a0a",
		foreground: "#fafafa",
		border: "#27272a",
		card: "#18181b",
		cardForeground: "#fafafa",
		popover: "#18181b",
		popoverForeground: "#fafafa",
		muted: "#27272a",
		mutedForeground: "#a1a1aa",
		accent: "#3b82f6",
		accentForeground: "#ffffff",
		destructive: "#dc2626",
		destructiveForeground: "#ffffff",
		ring: "#3b82f6",
	},
	ocean: {
		name: "Ocean",
		primary: "#0ea5e9",
		background: "#f0f9ff",
		foreground: "#0c4a6e",
		border: "#bae6fd",
		card: "#ffffff",
		cardForeground: "#0c4a6e",
		popover: "#ffffff",
		popoverForeground: "#0c4a6e",
		muted: "#e0f2fe",
		mutedForeground: "#0369a1",
		accent: "#0ea5e9",
		accentForeground: "#ffffff",
		destructive: "#dc2626",
		destructiveForeground: "#ffffff",
		ring: "#0ea5e9",
	},
	forest: {
		name: "Forest",
		primary: "#22c55e",
		background: "#f0fdf4",
		foreground: "#14532d",
		border: "#bbf7d0",
		card: "#ffffff",
		cardForeground: "#14532d",
		popover: "#ffffff",
		popoverForeground: "#14532d",
		muted: "#dcfce7",
		mutedForeground: "#166534",
		accent: "#22c55e",
		accentForeground: "#ffffff",
		destructive: "#dc2626",
		destructiveForeground: "#ffffff",
		ring: "#22c55e",
	},
};

export class ThemeManager {
	private mode: ThemeMode = "system";
	private preset: string = "default";
	private listeners: Set<(mode: ThemeMode, preset: string) => void> = new Set();

	constructor() {
		this.loadFromStorage();
		this.applyTheme();
	}

	setMode(mode: ThemeMode): void {
		this.mode = mode;
		this.saveToStorage();
		this.applyTheme();
		this.notifyListeners();
	}

	setPreset(preset: string): void {
		if (!themePresets[preset]) {
			console.warn(`Theme preset "${preset}" not found`);
			return;
		}

		this.preset = preset;
		this.saveToStorage();
		this.applyTheme();
		this.notifyListeners();
	}

	getMode(): ThemeMode {
		return this.mode;
	}

	getPreset(): string {
		return this.preset;
	}

	getEffectiveMode(): "light" | "dark" {
		if (this.mode === "system") {
			return this.getSystemPreference();
		}
		return this.mode;
	}

	getCurrentPreset(): ThemePreset {
		const effectiveMode = this.getEffectiveMode();
		if (effectiveMode === "dark" && this.preset === "default") {
			return themePresets.dark;
		}
		return themePresets[this.preset] || themePresets.default;
	}

	toggleMode(): void {
		const effectiveMode = this.getEffectiveMode();
		this.setMode(effectiveMode === "light" ? "dark" : "light");
	}

	private getSystemPreference(): "light" | "dark" {
		if (typeof window === "undefined") return "light";

		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}

	private applyTheme(): void {
		if (typeof document === "undefined") return;

		const effectiveMode = this.getEffectiveMode();
		const preset = this.getCurrentPreset();

		const root = document.documentElement;

		root.setAttribute("data-theme", effectiveMode);
		root.setAttribute("data-preset", this.preset);

		Object.entries(preset).forEach(([key, value]) => {
			if (key === "name") return;
			root.style.setProperty(`--${key}`, value);
		});
	}

	private saveToStorage(): void {
		if (typeof localStorage === "undefined") return;

		try {
			localStorage.setItem("wdocs-theme-mode", this.mode);
			localStorage.setItem("wdocs-theme-preset", this.preset);
		} catch (error) {
			console.warn("Failed to save theme to localStorage:", error);
		}
	}

	private loadFromStorage(): void {
		if (typeof localStorage === "undefined") return;

		try {
			const savedMode = localStorage.getItem("wdocs-theme-mode") as ThemeMode;
			const savedPreset = localStorage.getItem("wdocs-theme-preset");

			if (savedMode && ["light", "dark", "system"].includes(savedMode)) {
				this.mode = savedMode;
			}

			if (savedPreset && themePresets[savedPreset]) {
				this.preset = savedPreset;
			}
		} catch (error) {
			console.warn("Failed to load theme from localStorage:", error);
		}
	}

	subscribe(listener: (mode: ThemeMode, preset: string) => void): () => void {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	}

	private notifyListeners(): void {
		this.listeners.forEach((listener) => {
			listener(this.mode, this.preset);
		});
	}

	reset(): void {
		this.mode = "system";
		this.preset = "default";
		this.saveToStorage();
		this.applyTheme();
		this.notifyListeners();
	}
}

export const themeManager = new ThemeManager();
