<script setup lang="ts">
const icons = [
	"i-heroicons-star",
	"i-heroicons-heart",
	"i-heroicons-bolt",
	"i-heroicons-sun",
];

const emit = defineEmits(["select-icon"]);

const selectIcon = (icon: string) => {
	emit("select-icon", icon);
};
</script>

<template>
  <div class="absolute top-14 left-4 bg-white border rounded-lg shadow-lg p-2 grid grid-cols-4 gap-2">
    <button
      v-for="icon in icons"
      :key="icon"
      class="p-2 rounded-md hover:bg-gray-100 flex items-center justify-center"
      @click="selectIcon(icon)"
    >
      <div :class="[icon, 'w-6 h-6']" />
    </button>
  </div>
</template>
