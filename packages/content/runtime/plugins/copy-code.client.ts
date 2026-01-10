import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
	if (import.meta.client) {
		document.addEventListener("click", (e) => {
			const button = e.target as HTMLElement;
			if (button.classList.contains("copy-code-button")) {
				const code = button.getAttribute("data-code");
				if (code) {
					void navigator.clipboard.writeText(decodeURIComponent(code));
					button.textContent = "Copied!";
					setTimeout(() => {
						button.textContent = "Copy";
					}, 2000);
				}
			}
		});
	}
});
