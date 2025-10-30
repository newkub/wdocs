<script lang="ts">
import { onClickOutside } from "@vueuse/core";
import {
	defineComponent,
	type FunctionalComponent,
	type HTMLAttributes,
	h,
	inject,
	provide,
	type Ref,
	ref,
} from "vue";

// --- Context for Injection ---
const MENU_DROPDOWN_INJECTION_KEY = Symbol(
	"dropdown",
) as import("vue").InjectionKey<MenuDropdownContext>;

interface MenuDropdownContext {
	isOpen: Ref<boolean>;
	toggleDropdown: () => void;
	closeDropdown: () => void;
}

// --- Root Component ---
export const MenuDropdown = defineComponent({
	name: "MenuDropdown",
	setup(_, { slots }) {
		const isOpen = ref(false);

		function toggleDropdown() {
			isOpen.value = !isOpen.value;
		}

		function closeDropdown() {
			isOpen.value = false;
		}

		provide<MenuDropdownContext>(MENU_DROPDOWN_INJECTION_KEY, {
			closeDropdown,
			isOpen,
			toggleDropdown,
		});

		return () => h("div", { class: "relative inline-block text-left" }, slots);
	},
});

// --- Trigger Component ---
export const MenuDropdownTrigger: FunctionalComponent = (_, { slots }) => {
	const context = inject(MENU_DROPDOWN_INJECTION_KEY);
	if (!context) return null;
	return h("div", { onClick: context.toggleDropdown }, slots);
};
MenuDropdownTrigger.displayName = "DropdownMenuTrigger";

// --- Content Component ---
export const MenuDropdownContent = defineComponent({
	name: "MenuDropdownContent",
	props: {
		class: { default: "", type: String },
	},
	setup(props, { slots }) {
		const context = inject(MENU_DROPDOWN_INJECTION_KEY);
		if (!context) return null;

		const contentRef = ref(null);
		onClickOutside(contentRef, context.closeDropdown);

		// Function to handle clicks on the dropdown content itself
		const handleContentClick = (e: Event) => {
			// Close dropdown when clicking on the content (but not on interactive elements)
			const target = e.target as HTMLElement;
			if (
				target.closest('[role="menuitem"]') ||
				target.closest("button") ||
				target.closest("a")
			) {
				// Don't close if clicking on menu items or interactive elements
				return;
			}
			context.closeDropdown();
		};

		return () =>
			context.isOpen.value
				? h(
						"div",
						{
							class: [
								"origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10",
								props.class,
							],
							onClick: handleContentClick,
							ref: contentRef,
						},
						h(
							"div",
							{ "aria-orientation": "vertical", class: "py-1", role: "menu" },
							slots,
						),
					)
				: null;
	},
});

// --- Item Component ---
export const MenuDropdownItem: FunctionalComponent<
	HTMLAttributes & { inset?: boolean }
> = (props, { slots }) => {
	const context = inject(MENU_DROPDOWN_INJECTION_KEY);
	if (!context) return null;

	return h(
		"div",
		{
			class: [
				"block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer",
				props.inset && "pl-8",
				props.class,
			],
			onClick: context.closeDropdown,
			role: "menuitem",
		},
		slots,
	);
};
MenuDropdownItem.displayName = "DropdownMenuItem";

// --- Label Component ---
export const MenuDropdownLabel: FunctionalComponent<
	HTMLAttributes & { inset?: boolean }
> = (props, { slots }) => {
	return h(
		"div",
		{
			class: [
				"px-4 py-2 text-xs font-semibold text-gray-500",
				props.inset && "pl-8",
				props.class,
			],
		},
		slots,
	);
};
MenuDropdownLabel.displayName = "MenuDropdownLabel";

// --- Separator Component ---
export const MenuDropdownSeparator: FunctionalComponent<HTMLAttributes> = (
	props,
) => {
	return h("div", { class: ["-mx-1 my-1 h-px bg-gray-200", props.class] });
};
MenuDropdownSeparator.displayName = "MenuDropdownSeparator";

// --- Shortcut Component ---
export const MenuDropdownShortcut: FunctionalComponent<HTMLAttributes> = (
	props,
	{ slots },
) => {
	return h(
		"span",
		{ class: ["ml-auto text-xs tracking-widest text-gray-400", props.class] },
		slots,
	);
};
MenuDropdownShortcut.displayName = "MenuDropdownShortcut";
</script>

<template>
  <!-- This file only exports components and does not have its own template. -->
</template>