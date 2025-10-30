<script setup lang="ts">
import { type ComponentPublicInstance, ref } from "vue";
import MarkdownEditor from "./MarkdownEditor.vue";
import TextEditorToolbar from "./TextEditorToolbar.vue";

interface EditorExpose {
	focus: () => void;
	focusEnd: () => void;
	applyFormat: (command: string, value?: string) => void;
}

const props = withDefaults(
	defineProps<{
		modelValue: string;
		showToolbar?: boolean;
		placeholder?: string;
	}>(),
	{
		placeholder: "",
		showToolbar: true,
	},
);

const emit = defineEmits(["update:modelValue", "submit"]);

const editorRef = ref<(ComponentPublicInstance & EditorExpose) | null>(null);

function applyFormat(command: string, value?: string) {
	editorRef.value?.applyFormat(command, value);
}

defineExpose({
	focus: () => editorRef.value?.focus(),
	focusEnd: () => editorRef.value?.focusEnd?.(),
});
</script>

<template>
  <div class="border border-gray-300 rounded-lg">
    <TextEditorToolbar v-if="props.showToolbar" @command="applyFormat" />

    <MarkdownEditor
      ref="editorRef"
      :model-value="props.modelValue"
      :placeholder="props.placeholder"
      @update:model-value="emit('update:modelValue', $event)"
      @submit="emit('submit')"
    />
  </div>
</template>
