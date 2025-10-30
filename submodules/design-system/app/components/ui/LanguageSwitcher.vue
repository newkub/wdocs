<script setup lang="ts">
import { ref } from "vue";

const languages = [
	{ code: "en", name: "English" },
	{ code: "th", name: "Thai" },
];

const isOpen = ref(false);
const selectedLanguage = ref(
	languages.find((l) => l.code === "en") || languages[0],
);

function toggleDropdown() {
	isOpen.value = !isOpen.value;
}

function selectLanguage(lang: (typeof languages)[0]) {
	selectedLanguage.value = lang;
	isOpen.value = false;
	// TODO: Implement language switching logic
}
</script>

<template>
  <div class="relative">
    <button v-if="selectedLanguage" @click="toggleDropdown" class="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors p-2 rounded-md hover:bg-gray-100">
      <div class="i-mdi-web" />
      <span>{{ selectedLanguage.name }}</span>
      <div class="i-mdi-chevron-down transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>
    <div v-if="isOpen" class="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
      <ul>
        <li v-for="lang in languages" :key="lang.code">
          <a v-if="selectedLanguage" @click.prevent="selectLanguage(lang)" href="#" class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100" :class="selectedLanguage.code === lang.code ? 'text-primary font-semibold' : 'text-gray-700'">
            {{ lang.name }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
