<script lang="ts">
import {
	defineComponent,
	type FunctionalComponent,
	type HTMLAttributes,
	h,
	inject,
	provide,
	type Ref,
	ref,
	Teleport,
	watch,
} from "vue";

// --- Context for Injection ---
const DIALOG_INJECTION_KEY = Symbol(
	"dialog",
) as import("vue").InjectionKey<DialogContext>;

interface DialogContext {
	isOpen: Ref<boolean>;
	closeDialog: () => void;
}

// --- Root Component ---
export const Dialog = defineComponent({
	emits: ["update:open"],
	name: "Dialog",
	props: {
		open: {
			default: undefined,
			type: Boolean,
		},
	},
	setup(props, { emit, slots }) {
		const isOpen = ref(props.open || false);

		watch(
			() => props.open,
			(value) => {
				if (value !== undefined) {
					isOpen.value = value;
				}
			},
		);

		function closeDialog() {
			isOpen.value = false;
			emit("update:open", false);
		}

		provide<DialogContext>(DIALOG_INJECTION_KEY, {
			closeDialog,
			isOpen,
		});

		return () => slots.default?.();
	},
});

// --- Trigger Component ---
export const DialogTrigger = defineComponent({
	emits: ["click"],
	name: "DialogTrigger",
	setup(_, { emit, slots }) {
		const context = inject(DIALOG_INJECTION_KEY);

		if (!context) {
			console.error("DialogTrigger must be used within a Dialog component.");
			return () => slots.default?.();
		}

		const { isOpen } = context;

		function handleClick() {
			isOpen.value = true;
			emit("click");
		}

		return () => h("div", { onClick: handleClick }, slots);
	},
});

// --- Content Component ---
export const DialogContent = defineComponent({
	name: "DialogContent",
	props: {
		class: {
			default: "",
			type: String,
		},
	},
	setup(props, { slots }) {
		const context = inject(DIALOG_INJECTION_KEY);

		if (!context) {
			console.error("DialogContent must be used within a Dialog component.");
			return () => null;
		}

		const { isOpen, closeDialog } = context;

		return () =>
			h(
				Teleport as Component,
				{ to: "body" },
				isOpen.value
					? h(
							"div",
							{
								class: "fixed inset-0 z-50 bg-black/80",
								onClick: closeDialog,
							},
							h(
								"div",
								{
									class: [
										"fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
										props.class,
									],
									onClick: (e: MouseEvent) => e.stopPropagation(),
								},
								slots,
							),
						)
					: undefined,
			);
	},
});

// --- Close Component ---
export const DialogClose = defineComponent({
	name: "DialogClose",
	setup() {
		const context = inject(DIALOG_INJECTION_KEY);

		if (!context) {
			console.error("DialogClose must be used within a Dialog component.");
			return () => null;
		}

		const { closeDialog } = context;

		return () =>
			h(
				"button",
				{
					class:
						"absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
					onClick: closeDialog,
				},
				[
					h("span", { class: "i-mdi-close h-4 w-4" }),
					h("span", { class: "sr-only" }, "Close"),
				],
			);
	},
});

// --- Simple Functional Components ---
export const DialogHeader: FunctionalComponent<HTMLAttributes> = (
	props,
	{ slots },
) => {
	return h(
		"div",
		{
			class: [
				"flex flex-col space-y-1.5 text-center sm:text-left",
				props.class,
			],
		},
		slots,
	);
};
DialogHeader.displayName = "DialogHeader";

export const DialogFooter: FunctionalComponent<HTMLAttributes> = (
	props,
	{ slots },
) => {
	return h(
		"div",
		{
			class: [
				"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
				props.class,
			],
		},
		slots,
	);
};
DialogFooter.displayName = "DialogFooter";

export const DialogTitle: FunctionalComponent<HTMLAttributes> = (
	props,
	{ slots },
) => {
	return h(
		"h2",
		{
			class: ["text-lg font-semibold leading-none tracking-tight", props.class],
		},
		slots,
	);
};
DialogTitle.displayName = "DialogTitle";

export const DialogDescription: FunctionalComponent<HTMLAttributes> = (
	props,
	{ slots },
) => {
	return h(
		"p",
		{ class: ["text-sm text-muted-foreground", props.class] },
		slots,
	);
};
DialogDescription.displayName = "DialogDescription";
</script>

<template>
  <!-- This file only exports components and does not have its own template. -->
</template>
