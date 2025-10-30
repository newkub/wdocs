<script setup lang="ts">
const emit = defineEmits(["command"]);

function execute(command: string, value?: string) {
	emit("command", command, value);
}

function insertLink() {
	const url = prompt("Enter the URL:");
	if (url) {
		execute("createLink", url);
	}
}
</script>

<template>
  <div class="toolbar flex items-center p-2 border-b border-gray-300 bg-gray-50 rounded-t-lg space-x-1">
    <button @click="execute('formatBlock', 'h1')" class="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
      <div class="i-mdi-format-header-1 w-5 h-5" />
    </button>
    <button @click="execute('formatBlock', 'h2')" class="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
      <div class="i-mdi-format-header-2 w-5 h-5" />
    </button>
    <button @click="execute('formatBlock', 'h3')" class="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
      <div class="i-mdi-format-header-3 w-5 h-5" />
    </button>
    <div class="w-px h-5 bg-gray-300 mx-1" />
    <button @click="execute('undo')" class="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
      <div class="i-mdi-undo w-5 h-5" />
    </button>
    <button @click="execute('redo')" class="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
      <div class="i-mdi-redo w-5 h-5" />
    </button>
    <div class="w-px h-5 bg-gray-300 mx-1" />
    <button @click="execute('bold')" class="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
      <div class="i-mdi-format-bold w-5 h-5" />
    </button>
    <button @click="execute('italic')" class="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
      <div class="i-mdi-format-italic w-5 h-5" />
    </button>
    <button @click="execute('strikeThrough')" class="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
      <div class="i-mdi-format-strikethrough w-5 h-5" />
    </button>
    <div class="w-px h-5 bg-gray-300 mx-1" />
    <button @click="execute('insertUnorderedList')" class="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
      <div class="i-mdi-format-list-bulleted w-5 h-5" />
    </button>
    <button @click="execute('insertOrderedList')" class="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
      <div class="i-mdi-format-list-numbered w-5 h-5" />
    </button>
    <button @click="execute('formatBlock', 'blockquote')" class="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
      <div class="i-mdi-format-quote-close w-5 h-5" />
    </button>
    <button @click="insertLink" class="p-2 rounded-md text-gray-700 hover:bg-gray-200 transition-colors">
      <div class="i-mdi-link-variant w-5 h-5" />
    </button>
  </div>
</template>
