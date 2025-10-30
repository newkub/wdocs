<script lang="ts">
import { onClickOutside } from "@vueuse/core";
import {
	computed,
	defineComponent,
	type FunctionalComponent,
	type HTMLAttributes,
	h,
	inject,
	provide,
	type Ref,
	ref,
	type WritableComputedRef,
} from "vue";

// --- Context for Injection ---
interface SelectContext {
	model: WritableComputedRef<string | number | undefined>;
	isOpen: Ref<boolean>;
	toggle: () => void;
	close: () => void;
}
const SELECT_INJECTION_KEY = Symbol(
	"select",
) as import("vue").InjectionKey<SelectContext>;

// --- Root Component ---
export const Select = defineComponent({
	emits: ["update:modelValue"],
	name: "Select",
	props: {
		modelValue: { default: undefined, type: [String, Number] },
	},
	setup(props, { emit, slots }) {
		const isOpen = ref(false);
		const model = computed({
			get: () => props.modelValue,
			set: (value) => emit("update:modelValue", value),
		});

		function toggle() {
			isOpen.value = !isOpen.value;
		}

		function close() {
			isOpen.value = false;
		}

		provide<SelectContext>(SELECT_INJECTION_KEY, {
			close,
			isOpen,
			model,
			toggle,
		});

		return () => h("div", { class: "relative" }, slots);
	},
});

// --- Trigger Component ---
export const SelectTrigger: FunctionalComponent = (_, { slots }) => {
	const context = inject(SELECT_INJECTION_KEY);
	if (!context) return null;

	return h(
		"button",
		{
			class:
				"flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
			onClick: context.toggle,
		},
		[
			slots.default?.(),
			h("span", { class: "i-mdi-chevron-down h-4 w-4 opacity-50" }),
		],
	);
};
SelectTrigger.displayName = "SelectTrigger";

// --- Value Component ---
export const SelectValue: FunctionalComponent = (_, { slots }) => {
	return h("span", slots);
};
SelectValue.displayName = "SelectValue";

// --- Content Component ---
export const SelectContent = defineComponent({
	name: "SelectContent",
	props: {
		class: { default: "", type: String },
	},
	setup(props, { slots }) {
		const context = inject(SELECT_INJECTION_KEY);
		if (!context) return null;

		const contentRef = ref(null);
		onClickOutside(contentRef, context.close);

		return () =>
			context.isOpen.value
				? h(
						"div",
						{
							class: [
								"absolute z-50 w-full mt-1 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
								props.class,
							],
							ref: contentRef,
						},
						h("div", { class: "py-1" }, slots),
					)
				: null;
	},
});

// --- Item Component ---
interface SelectItemProps extends HTMLAttributes {
	value: string | number;
}
export const SelectItem: FunctionalComponent<SelectItemProps> = (
	props,
	{ slots },
) => {
	const context = inject(SELECT_INJECTION_KEY);
	if (!context) return null;

	const isSelected = () => context.model.value === props.value;

	function selectItem() {
		if (!context) return;
		context.model.value = props.value;
		context.close();
	}

	return h(
		"div",
		{
			class:
				"flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer",
			onClick: selectItem,
		},
		[
			isSelected() ? h("span", { class: "i-mdi-check h-4 w-4 mr-2" }) : null,
			slots.default?.(),
		],
	);
};
SelectItem.displayName = "SelectItem";

// --- Label Component ---
export const SelectLabel: FunctionalComponent<HTMLAttributes> = (
	props,
	{ slots },
) => {
	return h(
		"div",
		{ class: ["px-4 py-2 text-xs font-semibold text-gray-500", props.class] },
		slots,
	);
};
SelectLabel.displayName = "SelectLabel";

// --- Separator Component ---
export const SelectSeparator: FunctionalComponent<HTMLAttributes> = (props) => {
	return h("div", { class: ["-mx-1 my-1 h-px bg-gray-200", props.class] });
};
SelectSeparator.displayName = "SelectSeparator";
</script>

<template>
  <!-- This file only exports components and does not have its own template. -->
</template>
