<script setup lang="ts">
interface Props {
	placeholder?: string;
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	loading?: boolean;
	clearable?: boolean;
	autofocus?: boolean;
	icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
	autofocus: true,
	clearable: true,
	disabled: false,
	icon: "i-mdi-magnify",
	loading: false,
	placeholder: "Search...",
	size: "md",
});

const model = defineModel<string>();

const emit = defineEmits<{
	keydown: [event: KeyboardEvent];
	clear: [];
}>();

const inputRef = ref<HTMLInputElement | null>(null);

function handleKeydown(event: KeyboardEvent) {
	emit("keydown", event);
}

function clearSearch() {
	model.value = "";
	emit("clear");
	inputRef.value?.focus();
}

const sizeClasses = computed(() => {
	switch (props.size) {
		case "sm":
			return "px-3 py-1.5 text-sm";
		case "lg":
			return "px-5 py-3 text-lg";
		default:
			return "px-4 py-2 text-base";
	}
});

const iconSizeClasses = computed(() => {
	switch (props.size) {
		case "sm":
			return "w-4 h-4";
		case "lg":
			return "w-6 h-6";
		default:
			return "w-5 h-5";
	}
});

onMounted(() => {
	if (props.autofocus) {
		nextTick(() => {
			inputRef.value?.focus();
		});
	}
});

defineExpose({
	blur: () => inputRef.value?.blur(),
	focus: () => inputRef.value?.focus(),
});
</script>

<template>
  <div class="relative w-full">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <div
        v-if="!loading"
        :class="[icon, iconSizeClasses, 'text-gray-400']"
      />
      <div
        v-else
        :class="[iconSizeClasses, 'i-mdi-loading animate-spin text-gray-400']"
      />
    </div>
    
    <input
      ref="inputRef"
      v-model="model"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled || loading"
      :class="[
        'w-full rounded-lg border transition-all duration-200',
        'bg-white',
        'border-gray-300',
        'text-gray-900',
        'placeholder-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses,
        'pl-10',
        clearable && model ? 'pr-10' : 'pr-4'
      ]"
      @keydown="handleKeydown"
    >
    
    <button
      v-if="clearable && model && !loading"
      type="button"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
      @click="clearSearch"
    >
      <div :class="[iconSizeClasses, 'i-mdi-close-circle']" />
    </button>
  </div>
</template>
