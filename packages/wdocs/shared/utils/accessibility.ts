export interface A11yConfig {
	enableKeyboardNavigation: boolean;
	enableScreenReaderSupport: boolean;
	enableFocusManagement: boolean;
	announceErrors: boolean;
}

export class AccessibilityManager {
	private config: A11yConfig;
	private focusHistory: HTMLElement[] = [];
	private liveRegion: HTMLElement | null = null;

	constructor(config: Partial<A11yConfig> = {}) {
		this.config = {
			enableKeyboardNavigation: true,
			enableScreenReaderSupport: true,
			enableFocusManagement: true,
			announceErrors: true,
			...config,
		};

		if (typeof document !== "undefined") {
			this.init();
		}
	}

	private init(): void {
		this.createLiveRegion();
		this.setupKeyboardNavigation();
	}

	private setupFocusManagement(): void {
		if (!this.config.enableFocusManagement) return;

		document.addEventListener("focusin", (e) => {
			const target = e.target as HTMLElement;
			if (target && target !== document.body) {
				this.focusHistory.push(target);
				if (this.focusHistory.length > 10) {
					this.focusHistory.shift();
				}
			}
		});
	}

	private createLiveRegion(): void {
		if (!this.config.enableScreenReaderSupport) return;

		this.liveRegion = document.createElement("div");
		this.liveRegion.setAttribute("aria-live", "polite");
		this.liveRegion.setAttribute("aria-atomic", "true");
		this.liveRegion.className = "sr-only";
		this.liveRegion.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;";
		document.body.appendChild(this.liveRegion);
	}

	announce(message: string, priority: "polite" | "assertive" = "polite"): void {
		if (!this.config.enableScreenReaderSupport || !this.liveRegion) return;

		this.liveRegion.setAttribute("aria-live", priority);
		this.liveRegion.textContent = "";

		requestAnimationFrame(() => {
			this.liveRegion!.textContent = message;
		});
	}

	setupKeyboardNavigation(): void {
		if (!this.config.enableKeyboardNavigation) return;

		document.addEventListener("keydown", (_e) => {
			if (_e.key === "Escape") {
				this.handleEscapeKey(_e);
			}

			if (_e.key === "Tab") {
				this.handleTabKey(_e);
			}
		});
	}

	private handleEscapeKey(_e: KeyboardEvent): void {
		const activeElement = document.activeElement as HTMLElement;

		if (activeElement?.closest("[role=\"dialog\"], .modal, .dropdown")) {
			const container = activeElement.closest("[role=\"dialog\"], .modal, .dropdown") as HTMLElement;
			const closeButton = container.querySelector("[data-close], [aria-label=\"Close\"], button.close");

			if (closeButton) {
				(closeButton as HTMLElement).click();
				this.announce("Dialog closed");
			}
		}
	}

	private handleTabKey(e: KeyboardEvent): void {
		const activeElement = document.activeElement as HTMLElement;
		const modal = activeElement?.closest("[role=\"dialog\"], .modal");

		if (modal) {
			this.trapFocus(modal, e);
		}
	}

	trapFocus(container: HTMLElement, e: KeyboardEvent): void {
		if (!this.config.enableFocusManagement) return;

		const focusableElements = container.querySelectorAll(
			"button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
		);

		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0] as HTMLElement;
		const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

		if (e.shiftKey) {
			if (document.activeElement === firstElement) {
				e.preventDefault();
				lastElement.focus();
			}
		} else {
			if (document.activeElement === lastElement) {
				e.preventDefault();
				firstElement.focus();
			}
		}
	}

	saveFocus(): void {
		if (!this.config.enableFocusManagement) return;

		const activeElement = document.activeElement as HTMLElement;
		if (activeElement) {
			this.focusHistory.push(activeElement);
		}
	}

	restoreFocus(): void {
		if (!this.config.enableFocusManagement) return;

		const previousElement = this.focusHistory.pop();
		if (previousElement) {
			previousElement.focus();
		}
	}

	setAriaLabel(element: HTMLElement, label: string): void {
		element.setAttribute("aria-label", label);
	}

	setAriaDescribedBy(element: HTMLElement, descriptionId: string): void {
		element.setAttribute("aria-describedby", descriptionId);
	}

	setAriaExpanded(element: HTMLElement, expanded: boolean): void {
		element.setAttribute("aria-expanded", String(expanded));
	}

	setAriaHidden(element: HTMLElement, hidden: boolean): void {
		if (hidden) {
			element.setAttribute("aria-hidden", "true");
		} else {
			element.removeAttribute("aria-hidden");
		}
	}

	setRole(element: HTMLElement, role: string): void {
		element.setAttribute("role", role);
	}

	announceError(message: string): void {
		if (!this.config.announceErrors) return;

		this.announce(message, "assertive");
	}

	validateA11y(): Array<{ element: string; issue: string; severity: "error" | "warning" }> {
		const issues: Array<{ element: string; issue: string; severity: "error" | "warning" }> = [];

		const imagesWithoutAlt = document.querySelectorAll("img:not([alt])");
		for (const img of imagesWithoutAlt) {
			issues.push({
				element: img.outerHTML.slice(0, 100),
				issue: "Image missing alt attribute",
				severity: "error",
			});
		}

		const linksWithoutText = document.querySelectorAll("a:not([aria-label]):empty");
		for (const link of linksWithoutText) {
			issues.push({
				element: link.outerHTML.slice(0, 100),
				issue: "Link missing text or aria-label",
				severity: "error",
			});
		}

		const inputsWithoutLabels = document.querySelectorAll("input:not([aria-label]):not([id])");
		for (const input of inputsWithoutLabels) {
			issues.push({
				element: input.outerHTML.slice(0, 100),
				issue: "Input missing label or aria-label",
				severity: "warning",
			});
		}

		const buttonsWithoutText = document.querySelectorAll("button:not([aria-label]):empty");
		for (const button of buttonsWithoutText) {
			issues.push({
				element: button.outerHTML.slice(0, 100),
				issue: "Button missing text or aria-label",
				severity: "error",
			});
		}

		return issues;
	}

	skipToContent(targetId: string = "main"): void {
		const target = document.getElementById(targetId);
		if (target) {
			target.focus();
			this.announce("Skipped to main content");
		}
	}

	destroy(): void {
		if (this.liveRegion && this.liveRegion.parentNode) {
			this.liveRegion.parentNode.removeChild(this.liveRegion);
		}
		this.focusHistory = [];
	}
}

export const accessibilityManager = new AccessibilityManager();
