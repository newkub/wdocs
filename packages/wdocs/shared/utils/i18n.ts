export type Locale = "en" | "th" | "ja" | "zh" | "ko" | (string & {});

export interface LocaleMessages {
	[key: string]: string | LocaleMessages;
}

export interface I18nConfig {
	defaultLocale: Locale;
	availableLocales: Locale[];
	fallbackLocale: Locale;
	messages: Record<Locale, LocaleMessages>;
}

export class I18nManager {
	private config: I18nConfig;
	private currentLocale: Locale;
	private listeners: Set<(locale: Locale) => void> = new Set();

	constructor(config: I18nConfig) {
		this.config = config;
		this.currentLocale = this.detectLocale();
	}

	private detectLocale(): Locale {
		if (typeof window === "undefined") return this.config.defaultLocale;

		const stored = localStorage.getItem("wdocs-locale");
		if (stored && this.config.availableLocales.includes(stored)) {
			return stored;
		}

		const browserLocale = navigator.language.split("-")[0];
		if (this.config.availableLocales.includes(browserLocale)) {
			return browserLocale;
		}

		return this.config.defaultLocale;
	}

	setLocale(locale: Locale): void {
		if (!this.config.availableLocales.includes(locale)) {
			console.warn(`Locale "${locale}" is not available`);
			return;
		}

		this.currentLocale = locale;

		if (typeof localStorage !== "undefined") {
			localStorage.setItem("wdocs-locale", locale);
		}

		document.documentElement.lang = locale;
		this.notifyListeners();
	}

	getLocale(): Locale {
		return this.currentLocale;
	}

	t(key: string, params?: Record<string, string | number>): string {
		const message = this.getMessage(key, this.currentLocale) || this.getMessage(key, this.config.fallbackLocale) || key;

		if (!params) return message;

		return message.replace(/\{(\w+)\}/g, (match, param) => {
			return String(params[param] ?? match);
		});
	}

	private getMessage(key: string, locale: Locale): string | null {
		const messages = this.config.messages[locale];
		if (!messages) return null;

		const keys = key.split(".");
		let current: string | LocaleMessages = messages;

		for (const k of keys) {
			if (typeof current === "object" && k in current) {
				current = current[k];
			} else {
				return null;
			}
		}

		return typeof current === "string" ? current : null;
	}

	translate(key: string, params?: Record<string, string | number>): string {
		return this.t(key, params);
	}

	te(key: string): boolean {
		return this.getMessage(key, this.currentLocale) !== null;
	}

	getAvailableLocales(): Locale[] {
		return [...this.config.availableLocales];
	}

	subscribe(listener: (locale: Locale) => void): () => void {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	private notifyListeners(): void {
		this.listeners.forEach((listener) => listener(this.currentLocale));
	}

	addMessages(locale: Locale, messages: LocaleMessages): void {
		this.config.messages[locale] = {
			...this.config.messages[locale],
			...messages,
		};
	}

	formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
		return new Intl.NumberFormat(this.currentLocale, options).format(value);
	}

	formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
		return new Intl.DateTimeFormat(this.currentLocale, options).format(date);
	}

	formatCurrency(value: number, currency: string = "USD"): string {
		return new Intl.NumberFormat(this.currentLocale, {
			style: "currency",
			currency,
		}).format(value);
	}

	getDirection(): "ltr" | "rtl" {
		const rtlLocales = ["ar", "he", "fa", "ur"];
		return rtlLocales.includes(this.currentLocale) ? "rtl" : "ltr";
	}
}

export const defaultI18nConfig: I18nConfig = {
	defaultLocale: "en",
	availableLocales: ["en", "th"],
	fallbackLocale: "en",
	messages: {
		en: {
			common: {
				home: "Home",
				search: "Search",
				menu: "Menu",
				close: "Close",
				copy: "Copy",
				copied: "Copied!",
				error: "Error",
				loading: "Loading...",
				notFound: "Not Found",
			},
			navigation: {
				prev: "Previous",
				next: "Next",
				backToTop: "Back to top",
			},
			search: {
				placeholder: "Search documentation...",
				noResults: "No results found",
				results: "{count} results found",
			},
			theme: {
				light: "Light",
				dark: "Dark",
				system: "System",
			},
		},
		th: {
			common: {
				home: "หน้าแรก",
				search: "ค้นหา",
				menu: "เมนู",
				close: "ปิด",
				copy: "คัดลอก",
				copied: "คัดลอกแล้ว!",
				error: "ข้อผิดพลาด",
				loading: "กำลังโหลด...",
				notFound: "ไม่พบ",
			},
			navigation: {
				prev: "ก่อนหน้า",
				next: "ถัดไป",
				backToTop: "กลับด้านบน",
			},
			search: {
				placeholder: "ค้นหาเอกสาร...",
				noResults: "ไม่พบผลลัพธ์",
				results: "พบ {count} ผลลัพธ์",
			},
			theme: {
				light: "สว่าง",
				dark: "มืด",
				system: "ระบบ",
			},
		},
	},
};

export const i18nManager = new I18nManager(defaultI18nConfig);
