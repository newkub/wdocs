export interface AnalyticsEvent {
	name: string;
	properties?: Record<string, unknown>;
	timestamp?: number;
}

export interface PageViewEvent extends AnalyticsEvent {
	name: "page_view";
	properties: {
		path: string;
		title: string;
		referrer?: string;
	};
}

export interface SearchEvent extends AnalyticsEvent {
	name: "search";
	properties: {
		query: string;
		resultsCount: number;
	};
}

export interface AnalyticsConfig {
	enabled: boolean;
	trackPageViews: boolean;
	trackSearches: boolean;
	trackClicks: boolean;
	debug: boolean;
}

export class AnalyticsManager {
	private config: AnalyticsConfig;
	private eventQueue: AnalyticsEvent[] = [];
	private flushInterval: ReturnType<typeof setInterval> | null = null;
	private sessionId: string;

	constructor(config: Partial<AnalyticsConfig> = {}) {
		this.config = {
			enabled: true,
			trackPageViews: true,
			trackSearches: true,
			trackClicks: true,
			debug: false,
			...config,
		};

		this.sessionId = this.generateSessionId();

		if (typeof window !== "undefined") {
			this.startFlushInterval();
			this.trackPageView();
		}
	}

	private generateSessionId(): string {
		return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
	}

	track(event: AnalyticsEvent): void {
		if (!this.config.enabled) return;

		const eventWithTimestamp = {
			...event,
			timestamp: event.timestamp || Date.now(),
			sessionId: this.sessionId,
		};

		this.eventQueue.push(eventWithTimestamp);

		if (this.config.debug) {
			console.log("[Analytics]", eventWithTimestamp);
		}
	}

	trackPageView(path?: string, title?: string): void {
		if (!this.config.trackPageViews) return;

		this.track({
			name: "page_view",
			properties: {
				path: path || window.location.pathname,
				title: title || document.title,
				referrer: document.referrer || undefined,
			},
		});
	}

	trackSearch(query: string, resultsCount: number): void {
		if (!this.config.trackSearches) return;

		this.track({
			name: "search",
			properties: {
				query,
				resultsCount,
			},
		});
	}

	trackClick(element: string, context?: string): void {
		if (!this.config.trackClicks) return;

		this.track({
			name: "click",
			properties: {
				element,
				context,
			},
		});
	}

	trackError(error: Error, context?: string): void {
		this.track({
			name: "error",
			properties: {
				message: error.message,
				stack: error.stack,
				context,
			},
		});
	}

	private startFlushInterval(): void {
		this.flushInterval = setInterval(() => {
			void this.flush();
		}, 30000);
	}

	async flush(): Promise<void> {
		if (this.eventQueue.length === 0) return;

		const events = [...this.eventQueue];
		this.eventQueue = [];

		try {
			await this.sendEvents(events);
		} catch (error) {
			console.error("Failed to send analytics events:", error);
			this.eventQueue.unshift(...events);
		}
	}

	private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
		if (this.config.debug) {
			console.log("[Analytics] Sending events:", events);
			return;
		}

		const { wdocs } = (window as any).$nuxt?.runtimeConfig?.public || {};

		if (!wdocs?.analyticsUrl) {
			return;
		}

		await fetch(`${wdocs.analyticsUrl}/events`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(events),
		});
	}

	getSearchAnalytics(): Map<string, number> {
		const searchEvents = this.eventQueue.filter((e) => e.name === "search");
		const analytics = new Map<string, number>();

		for (const event of searchEvents) {
			const query = (event.properties as SearchEvent["properties"])?.query;
			if (query) {
				analytics.set(query, (analytics.get(query) || 0) + 1);
			}
		}

		return analytics;
	}

	getPageViewAnalytics(): Map<string, number> {
		const pageViewEvents = this.eventQueue.filter((e) => e.name === "page_view");
		const analytics = new Map<string, number>();

		for (const event of pageViewEvents) {
			const path = (event.properties as PageViewEvent["properties"])?.path;
			if (path) {
				analytics.set(path, (analytics.get(path) || 0) + 1);
			}
		}

		return analytics;
	}

	disable(): void {
		this.config.enabled = false;
	}

	enable(): void {
		this.config.enabled = true;
	}

	destroy(): void {
		if (this.flushInterval) {
			clearInterval(this.flushInterval);
		}
		void this.flush();
	}
}

export const analyticsManager = new AnalyticsManager();
