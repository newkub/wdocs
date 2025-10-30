<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
import type { MenuItem } from "~/shared/types/ui";
import { useMarkdownEditor } from "~/composables/useMarkdownEditor";
import { useMarkdownRender } from "~/composables/useMarkdownRender";

const props = withDefaults(
	defineProps<{
		modelValue: string;
		placeholder?: string;
		minHeight?: string;
		bordered?: boolean;
		submitOnEnter?: boolean;
		autoSave?: boolean;
		autoSaveKey?: string;
	}>(),
	{
		autoSave: false,
		autoSaveKey: "markdown-editor-draft",
		bordered: true,
		minHeight: "20rem",
		placeholder: "",
		submitOnEnter: true,
	},
);

const emit = defineEmits(["update:modelValue", "submit"]);

const editorRef = ref<HTMLDivElement | null>(null);
const isFocused = ref(false);

// Markdown rendering utilities
const { htmlToMarkdown, renderToHtml, cleanHtmlForConversion } =
	useMarkdownRender();

// Editor UI utilities
const {
	showMenu,
	menuPosition,
	menuTrigger,
	menuSearchQuery,
	menuItems,
	handleKeydown: onKeyDown,
	handlePaste: onPaste,
	setupKeyboardShortcuts,
} = useMarkdownEditor({
	onSubmit: () => emit("submit"),
	submitOnEnter: props.submitOnEnter,
});

// Auto-save draft
const draft = props.autoSave ? useLocalStorage(props.autoSaveKey, "") : ref("");

// Restore draft on mount
onMounted(() => {
	if (props.autoSave && draft.value && !props.modelValue) {
		if (editorRef.value) {
			editorRef.value.innerHTML = renderToHtml(draft.value);
		}
	}
});

function handleInput() {
	if (editorRef.value) {
		// Get the raw HTML content
		let html = editorRef.value.innerHTML;

		// Clean up the HTML before conversion
		html = cleanHtmlForConversion(html)
			.replace(/<div><br><\/div>/gi, "\n")
			.replace(/<div>/gi, "\n")
			.replace(/<\/div>/gi, "")
			.replace(/<span[^>]*>/gi, "")
			.replace(/<\/span>/gi, "")
			.trim();

		const markdown = htmlToMarkdown(html);
		emit("update:modelValue", markdown);

		// Save draft if auto-save is enabled
		if (props.autoSave && draft.value !== markdown) {
			draft.value = markdown;
		}
	}
}

let observer: MutationObserver | null = null;

function observe() {
	if (editorRef.value && observer) {
		observer.observe(editorRef.value, {
			characterData: true,
			childList: true,
			subtree: true,
		});
	}
}

function focusAtEnd() {
	if (!editorRef.value) return;

	editorRef.value.focus();

	// Move cursor to end
	const selection = window.getSelection();
	const range = document.createRange();

	if (editorRef.value.childNodes.length > 0) {
		const lastNode =
			editorRef.value.childNodes[editorRef.value.childNodes.length - 1];

		if (lastNode) {
			if (lastNode.nodeType === Node.TEXT_NODE) {
				range.setStart(lastNode, lastNode.textContent?.length || 0);
			} else if (lastNode.lastChild) {
				range.setStartAfter(lastNode.lastChild);
			} else {
				range.setStart(lastNode, 0);
			}
		}
	} else {
		range.setStart(editorRef.value, 0);
	}

	range.collapse(true);
	selection?.removeAllRanges();
	selection?.addRange(range);
}

defineExpose({
	applyFormat: (command: string, value?: string) => {
		if (editorRef.value) {
			editorRef.value.focus();
			document.execCommand(command, false, value);
		}
	},
	focus: () => editorRef.value?.focus(),
	focusEnd: focusAtEnd,
});

function handleMenuItemClick(item: MenuItem) {
	if (!item.action) return;

	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return;

	const range = selection.getRangeAt(0);
	const textNode = range.startContainer;

	if (textNode.nodeType !== Node.TEXT_NODE) return;

	const text = textNode.textContent || "";
	const cursorPos = range.startOffset;

	// Find trigger character
	const triggerChar = menuTrigger.value;
	const lastTriggerIndex = text.lastIndexOf(triggerChar || "", cursorPos);

	if (lastTriggerIndex !== -1) {
		// Remove trigger and search query
		const beforeTrigger = text.substring(0, lastTriggerIndex);
		const afterCursor = text.substring(cursorPos);

		// Handle different actions
		let replacement = "";

		if (item.action.startsWith("mention:")) {
			replacement = `@${item.label} `;
		} else {
			// Execute format command
			showMenu.value = false;
			editorRef.value?.focus();

			// Remove the trigger character first
			textNode.textContent = beforeTrigger + afterCursor;
			range.setStart(textNode, lastTriggerIndex);
			range.collapse(true);
			selection.removeAllRanges();
			selection.addRange(range);

			// Apply formatting
			switch (item.action) {
				case "h1":
				case "h2":
				case "h3":
					document.execCommand("formatBlock", false, item.action);
					break;
				case "bold":
					document.execCommand("bold", false);
					break;
				case "italic":
					document.execCommand("italic", false);
					break;
				case "strikethrough":
					document.execCommand("strikeThrough", false);
					break;
				case "ul":
					document.execCommand("insertUnorderedList", false);
					break;
				case "ol":
					document.execCommand("insertOrderedList", false);
					break;
				case "quote":
					document.execCommand("formatBlock", false, "blockquote");
					break;
				case "code":
					document.execCommand("formatBlock", false, "pre");
					break;
			}

			handleInput();
			return;
		}

		// For mentions, replace text
		textNode.textContent = beforeTrigger + replacement + afterCursor;
		range.setStart(textNode, lastTriggerIndex + replacement.length);
		range.collapse(true);
		selection.removeAllRanges();
		selection.addRange(range);
	}

	showMenu.value = false;
	handleInput();
}

onMounted(() => {
	if (editorRef.value) {
		editorRef.value.innerHTML = renderToHtml(props.modelValue);

		observer = new MutationObserver((mutations) => {
			let manualUpdate = false;
			for (const mutation of mutations) {
				if (
					mutation.type === "characterData" &&
					mutation.target.textContent?.includes("# ")
				) {
					const node = mutation.target as Text;
					const parent = node.parentElement;
					const text = node.textContent;
					if (!text) continue;

					const match = text.match(/^(#{1,3})\s/);
					if (
						match?.[1] &&
						parent &&
						parent.parentNode &&
						["P", "DIV"].includes(parent.tagName)
					) {
						const headingLevel = match[1].length;
						const headingTag = `h${headingLevel}`;

						const newHeading = document.createElement(headingTag);
						newHeading.textContent = text.substring(match[0].length);

						parent.parentNode.replaceChild(newHeading, parent);
						manualUpdate = true;

						const selection = window.getSelection();
						const range = document.createRange();
						range.setStart(newHeading.firstChild || newHeading, 0);
						range.collapse(true);
						selection?.removeAllRanges();
						selection?.addRange(range);
						break;
					}
				}
			}
			if (manualUpdate) {
				handleInput();
			}
		});

		observe();

		// Add focus and blur event listeners
		editorRef.value.addEventListener("focus", () => {
			isFocused.value = true;
		});

		editorRef.value.addEventListener("blur", () => {
			isFocused.value = false;
		});
	}
});

watch(
	() => props.modelValue,
	(newValue) => {
		if (
			editorRef.value &&
			htmlToMarkdown(editorRef.value.innerHTML) !== newValue
		) {
			editorRef.value.innerHTML = renderToHtml(newValue);
		}
	},
);
</script>

<template>
  <div class="relative">
    <div
      ref="editorRef"
      contenteditable="true"
      :data-placeholder="props.placeholder"
      :style="{ minHeight: props.minHeight }"
      :class="[
        'prose max-w-none w-full p-3 overflow-y-auto focus:outline-none relative empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:absolute',
        {
          'bg-white rounded-lg border border-gray-300': props.bordered,
          'bg-transparent': !props.bordered
        }
      ]"
      @input="handleInput"
      @keydown="onKeyDown"
      @paste="onPaste"
    />
    
    <UiMenuContext
      :show="showMenu"
      :x="menuPosition.x"
      :y="menuPosition.y"
      :items="menuItems"
      :searchable="true"
      positioning="above-cursor"
      @item-click="handleMenuItemClick"
      @close="showMenu = false"
    />
  </div>
</template>

<style>
.prose h1 {
  font-size: 1.875rem; line-height: 2.25rem; font-weight: 800;
}
.prose h2 {
  font-size: 1.5rem; line-height: 2rem; font-weight: 700;
}
.prose h3 {
  font-size: 1.25rem; line-height: 1.75rem; font-weight: 600;
}
.prose p {
  font-size: 1rem; line-height: 1.75rem;
}
.prose a {
  color: #3b82f6;
}
.prose code {
  background-color: #f3f4f6; padding: 0.2em 0.4em; margin: 0; font-size: 85%; border-radius: 6px;
}
.prose pre {
    background-color: #f3f4f6; padding: 1rem; border-radius: 8px;
}
</style>
