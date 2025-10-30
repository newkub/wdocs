<script setup lang="ts">
import { type Component, computed, provide, useSlots } from "vue";

interface TabItem {
	value: string;
	label: string;
	component?: Component;
}

const props = defineProps<{
	modelValue: string;
	tabs?: TabItem[];
}>();

const emit = defineEmits(["update:modelValue"]);

const activeTab = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

provide("activeTab", activeTab);

const slots = useSlots();
const hasDefaultSlot = computed(() => !!slots.default);
</script>

<template>
  <div class="flex gap-6">
    <!-- Smart Mode: Render based on `tabs` prop -->
    <template v-if="tabs?.length">
      <div class="flex flex-col gap-2 min-w-48">
        <slot name="list-header" />
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="[
            'px-4 py-2 text-left rounded-md transition-colors',
            activeTab === tab.value ? 'bg-muted text-foreground' : 'hover:bg-muted/50',
          ]"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="flex-1">
        <template v-for="tab in tabs" :key="tab.value">
          <div v-if="activeTab === tab.value">
            <component :is="tab.component" v-if="tab.component" />
          </div>
        </template>
      </div>
    </template>

    <!-- Manual Mode: Render based on default slot -->
    <template v-else-if="hasDefaultSlot">
      <slot />
    </template>
  </div>
</template>
