<script lang="ts">
import {
	computed,
	defineComponent,
	type FunctionalComponent,
	type HTMLAttributes,
	h,
	inject,
	provide,
	type WritableComputedRef,
} from "vue";

// --- Context for Injection ---
const RADIO_GROUP_INJECTION_KEY = Symbol(
	"radioGroup",
) as import("vue").InjectionKey<WritableComputedRef<string | undefined>>;

// --- Root Component ---
export const RadioGroup = defineComponent({
	emits: ["update:modelValue"],
	name: "RadioGroup",
	props: {
		class: { default: "", type: String },
		modelValue: { default: undefined, type: String },
	},
	setup(props, { emit, slots }) {
		const model = computed({
			get: () => props.modelValue,
			set: (value) => emit("update:modelValue", value),
		});

		provide(RADIO_GROUP_INJECTION_KEY, model);

		return () =>
			h(
				"div",
				{ class: ["grid gap-2", props.class], role: "radiogroup" },
				slots,
			);
	},
});

// --- Item Component ---
interface RadioGroupItemProps extends HTMLAttributes {
	id: string;
	value: string;
}

export const RadioGroupItem: FunctionalComponent<RadioGroupItemProps> = (
	props,
	{ slots },
) => {
	const model = inject(RADIO_GROUP_INJECTION_KEY);
	if (!model) return null;

	const isChecked = () => model.value === props.value;

	return h(
		"button",
		{
			"aria-checked": isChecked(),
			class: [
				"h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
				props.class,
			],
			"data-state": isChecked() ? "checked" : "unchecked",
			id: props.id,
			onClick: () => {
				model.value = props.value;
			},
			role: "radio",
			type: "button",
		},
		isChecked()
			? h("span", {
					class: "i-mdi-circle h-2.5 w-2.5 fill-current text-current",
				})
			: slots.default?.(),
	);
};
RadioGroupItem.displayName = "RadioGroupItem";
</script>

<template>
  <!-- This file only exports components and does not have its own template. -->
</template>
