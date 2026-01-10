export default defineNuxtPlugin(() => {
	if (process.client) {
		document.addEventListener("click", async (e) => {
			const target = e.target as HTMLElement;
			if (target.matches("button.copy-code-button")) {
				const code = decodeURIComponent(target.dataset.code || "");
				try {
					await navigator.clipboard.writeText(code);
					target.textContent = "Copied!";
					setTimeout(() => {
						target.textContent = "Copy";
					}, 2000);
				} catch (err) {
					console.error("Failed to copy text: ", err);
					target.textContent = "Error";
					setTimeout(() => {
						target.textContent = "Copy";
					}, 2000);
				}
			}
		});
	}
});
