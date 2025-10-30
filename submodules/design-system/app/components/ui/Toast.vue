<script setup lang="ts">
import { reactive, readonly, ref } from "vue";

interface Toast {
	id: string;
	title: string;
	description?: string;
	type: "success" | "error" | "warning" | "info";
	duration?: number;
}

const toasts = ref<Toast[]>([]);

// Toast composable logic moved inside the component
const add = (toast: Omit<Toast, "id">) => {
	const id = Math.random().toString(36).substr(2, 9);
	const newToast: Toast = {
		duration: 5000,
		id,
		...toast,
	};

	toasts.value.push(newToast);

	// Auto remove after duration
	if (newToast.duration && newToast.duration > 0) {
		setTimeout(() => {
			remove(id);
		}, newToast.duration);
	}

	return id;
};

const remove = (id: string) => {
	const index = toasts.value.findIndex((toast) => toast.id === id);
	if (index > -1) {
		toasts.value.splice(index, 1);
	}
};

const success = (title: string, description?: string) => {
	return add({ description, title, type: "success" });
};

const error = (title: string, description?: string) => {
	return add({ description, title, type: "error" });
};

const warning = (title: string, description?: string) => {
	return add({ description, title, type: "warning" });
};

const info = (title: string, description?: string) => {
	return add({ description, title, type: "info" });
};

// Expose toast functions for parent components
defineExpose({
	add,
	error,
	info,
	remove,
	success,
	toasts: readonly(toasts),
	warning,
});

// Toast type configurations using theme colors
const toastConfigs = {
	error: {
		bg: "bg-red-50",
		border: "border-red-200",
		icon: "text-red-600 i-mdi-alert-circle",
		iconBg: "bg-red-100",
		text: "text-red-800",
	},
	info: {
		bg: "bg-blue-50",
		border: "border-blue-200",
		icon: "text-blue-600 i-mdi-information",
		iconBg: "bg-blue-100",
		text: "text-blue-800",
	},
	success: {
		bg: "bg-green-50",
		border: "border-green-200",
		icon: "text-green-600 i-mdi-check-circle",
		iconBg: "bg-green-100",
		text: "text-green-800",
	},
	warning: {
		bg: "bg-yellow-50",
		border: "border-yellow-200",
		icon: "text-yellow-600 i-mdi-alert",
		iconBg: "bg-yellow-100",
		text: "text-yellow-800",
	},
} as const;

const getToastClasses = (type: string) => {
	const config =
		toastConfigs[type as keyof typeof toastConfigs] || toastConfigs.info;
	return `${config.bg} ${config.text} ${config.border} flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg border transition-all duration-300 transform translate-x-full animate-fade-in`;
};

const getIconClasses = (type: string) => {
	const config =
		toastConfigs[type as keyof typeof toastConfigs] || toastConfigs.info;
	return `${config.icon} w-5 h-5 mr-3 flex-shrink-0`;
};

// Handle toast removal
const handleRemove = (id: string) => {
	remove(id);
};
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="getToastClasses(toast.type)"
      >
        <div :class="getIconClasses(toast.type)" />
        <div class="flex-1">
          <div class="font-medium">{{ toast.title }}</div>
          <div v-if="toast.description" class="mt-1">{{ toast.description }}</div>
        </div>
        <button
          @click="handleRemove(toast.id)"
          class="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <div class="i-mdi-close w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
