export interface ImageOptimizationOptions {
	width?: number;
	height?: number;
	quality?: number;
	format?: "webp" | "avif" | "jpeg" | "png";
}

export interface PerformanceMetrics {
	fcp: number;
	lcp: number;
	tti: number;
	cls: number;
	fid: number;
}

export class PerformanceOptimizer {
	private observers: Map<string, PerformanceObserver> = new Map();
	private metrics: Partial<PerformanceMetrics> = {};

	observePerformanceMetrics(): void {
		if (typeof PerformanceObserver === "undefined") return;

		this.observeMetric("paint", (entries) => {
			for (const entry of entries) {
				if (entry.name === "first-contentful-paint") {
					this.metrics.fcp = entry.startTime;
				}
			}
		});

		this.observeMetric("largest-contentful-paint", (entries) => {
			const lastEntry = entries[entries.length - 1];
			if (lastEntry) {
				this.metrics.lcp = lastEntry.startTime;
			}
		});

		this.observeMetric("layout-shift", (entries) => {
			let clsValue = 0;
			for (const entry of entries) {
				if (!(entry as any).hadRecentInput) {
					clsValue += (entry as any).value;
				}
			}
			this.metrics.cls = clsValue;
		});

		this.observeMetric("first-input", (entries) => {
			for (const entry of entries) {
				if ((entry as any).processingStart) {
					this.metrics.fid = (entry as any).processingStart - entry.startTime;
				}
			}
		});
	}

	private observeMetric(type: string, callback: (entries: PerformanceEntryList) => void): void {
		try {
			const observer = new PerformanceObserver((list) => {
				callback(list.getEntries());
			});
			observer.observe({ type, buffered: true });
			this.observers.set(type, observer);
		} catch (error) {
			console.warn(`Failed to observe ${type}:`, error);
		}
	}

	getMetrics(): Partial<PerformanceMetrics> {
		return { ...this.metrics };
	}

	disconnect(): void {
		this.observers.forEach((observer) => observer.disconnect());
		this.observers.clear();
	}

	optimizeImageUrl(url: string, options: ImageOptimizationOptions = {}): string {
		const { width, height, quality = 80, format = "webp" } = options;

		if (!url.includes("?")) {
			url += "?";
		} else {
			url += "&";
		}

		const params = new URLSearchParams();
		if (width) params.append("w", String(width));
		if (height) params.append("h", String(height));
		params.append("q", String(quality));
		params.append("f", format);

		return `${url}${params.toString()}`;
	}

	generateSrcSet(url: string, sizes: number[], options: Omit<ImageOptimizationOptions, "width"> = {}): string {
		return sizes
			.map((size) => `${this.optimizeImageUrl(url, { ...options, width: size })} ${size}w`)
			.join(", ");
	}

	lazyLoadImages(): void {
		if (typeof IntersectionObserver === "undefined") return;

		const imageObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const img = entry.target as HTMLImageElement;
					if (img.dataset.src) {
						img.src = img.dataset.src;
						img.removeAttribute("data-src");
						imageObserver.unobserve(img);
					}
				}
			}
		});

		document.querySelectorAll("img[data-src]").forEach((img) => {
			imageObserver.observe(img);
		});
	}

	preloadCriticalResources(resources: Array<{ href: string; as: string; type?: string }>): void {
		for (const resource of resources) {
			const link = document.createElement("link");
			link.rel = "preload";
			link.href = resource.href;
			link.as = resource.as;
			if (resource.type) {
				link.type = resource.type;
			}
			document.head.appendChild(link);
		}
	}

	prefetchResources(urls: string[]): void {
		for (const url of urls) {
			const link = document.createElement("link");
			link.rel = "prefetch";
			link.href = url;
			document.head.appendChild(link);
		}
	}

	debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
		let timeout: ReturnType<typeof setTimeout> | null = null;

		return (...args: Parameters<T>) => {
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => func(...args), wait);
		};
	}

	throttle<T extends (...args: unknown[]) => unknown>(func: T, limit: number): (...args: Parameters<T>) => void {
		let inThrottle = false;

		return (...args: Parameters<T>) => {
			if (!inThrottle) {
				func(...args);
				inThrottle = true;
				setTimeout(() => {
					inThrottle = false;
				}, limit);
			}
		};
	}

	async measureRenderTime<T>(name: string, fn: () => Promise<T>): Promise<T> {
		const start = performance.now();
		try {
			return await fn();
		} finally {
			const duration = performance.now() - start;
			if (typeof performance !== "undefined" && performance.mark) {
				performance.mark(`${name}-start`);
				performance.mark(`${name}-end`);
				performance.measure(name, `${name}-start`, `${name}-end`);
			}
			console.log(`${name} took ${duration.toFixed(2)}ms`);
		}
	}
}

export const performanceOptimizer = new PerformanceOptimizer();
