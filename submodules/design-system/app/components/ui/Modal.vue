<script setup lang="ts">

interface ModalProps {
	modelValue: boolean;
	title?: string;
	showHeader?: boolean;
	panelClass?: string;
	transitionType?: "fade" | "slide-up";
	size?: "sm" | "md" | "lg" | "xl" | "full" | "custom";
}

const props = withDefaults(defineProps<ModalProps>(), {
	panelClass: "",
	showHeader: true,
	size: "md",
	title: "",
	transitionType: "fade",
});

const emit = defineEmits<(e: "update:modelValue", value: boolean) => void>();

// Compute panel classes based on size
const computedPanelClass = computed(() => {
	if (props.panelClass) return props.panelClass;

	const sizeClasses = {
		custom: "",
		full: "max-w-full h-full",
		lg: "max-w-4xl h-[80vh]",
		md: "max-w-2xl h-[70vh]",
		sm: "max-w-md h-[50vh]",
		xl: "max-w-6xl h-[85vh]",
	};

	return sizeClasses[props.size] || sizeClasses.md;
});

function close() {
	emit("update:modelValue", false);
}

function handleEscape(event: KeyboardEvent) {
	if (event.key === "Escape") {
		close();
	}
}

watch(
	() => props.modelValue,
	(isOpen) => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	},
);

onMounted(() => {
	window.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleEscape);
	document.body.style.overflow = ""; // Cleanup on component destroy
});
</script>

<template>
  <Teleport to="body">
    <Transition :name="props.transitionType === 'fade' ? 'modal-fade' : 'modal-slide-up'">
      <div v-if="props.modelValue" 
           class="fixed inset-0 bg-black/75 z-50 p-4" 
           :class="props.transitionType === 'fade' ? 'flex items-center justify-center' : 'flex items-end'"
           @click.self="close">
        <div :class="['bg-white shadow-xl w-full flex flex-col', computedPanelClass, props.transitionType === 'slide-up' ? 'rounded-t-lg' : 'rounded-lg']">
          <!-- Header -->
          <div v-if="props.showHeader" class="flex items-center justify-between p-4 border-b border-gray-200">
            <slot name="header">
              <h2 class="text-xl font-semibold">{{ props.title }}</h2>
            </slot>
            <button @click="close" class="p-2 rounded-full hover:bg-gray-100">
              <div class="i-mdi-close w-6 h-6"></div>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto min-h-0">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="p-4 border-t border-gray-200 mt-auto">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Fade Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Slide-up Transition */
.modal-slide-up-enter-active,
.modal-slide-up-leave-active {
  transition: transform 0.3s ease-in-out;
}
.modal-slide-up-enter-from,
.modal-slide-up-leave-to {
  transform: translateY(100%);
}
</style>