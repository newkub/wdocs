<script setup lang="ts">
interface Props {
	content?: string;
	class?: string;
}

const props = withDefaults(defineProps<Props>(), {
	class: "",
	content: "",
});

// Render Vue components dynamically
const renderedContent = computed(() => {
	if (!props.content) return "";

	// For now, just return the content as-is
	// In a real implementation, this would parse and render Vue components
	return props.content;
});
</script>

<template>
  <div
    :class="[
      'w-full h-full bg-white border-l border-gray-200 overflow-auto',
      props.class
    ]"
  >
    <div class="p-6">
      <!-- Vue component rendering area -->
      <div class="prose prose-lg max-w-none">
        <!-- Placeholder for rendered Vue components -->
        <div v-if="!renderedContent" class="text-gray-500 text-center py-12">
          <div class="i-mdi-monitor-dashboard text-6xl mb-4 text-gray-300" />
          <p>Vue components will be rendered here</p>
        </div>

        <!-- Rendered content would go here -->
        <div v-else>
          <!-- This is where Vue components would be dynamically rendered -->
          <div class="text-gray-700">
            {{ renderedContent }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
