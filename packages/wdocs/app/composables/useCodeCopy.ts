import { useClipboard } from "@vueuse/core";
import { onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";

export function useCodeCopy(mainEl: Ref<HTMLElement | null>) {
	const { copy } = useClipboard();

	function handleCodeCopy(event: MouseEvent) {
		const target = event.target as HTMLElement;
		const button = target.closest(".copy-code-button");

		if (button) {
			const code = button.getAttribute("data-code");
			if (code) {
				void copy(code);
				const copyIcon = button.querySelector(".copy-icon");
				const copiedIcon = button.querySelector(".copied-icon");
				if (copyIcon && copiedIcon) {
					copyIcon.classList.add("hidden");
					copiedIcon.classList.remove("hidden");
					setTimeout(() => {
						copyIcon.classList.remove("hidden");
						copiedIcon.classList.add("hidden");
					}, 2000);
				}
			}
		}
	}

	onMounted(() => {
		if (mainEl.value) {
			mainEl.value.addEventListener("click", handleCodeCopy);
		}
	});

	onUnmounted(() => {
		if (mainEl.value) {
			mainEl.value.removeEventListener("click", handleCodeCopy);
		}
	});
}
