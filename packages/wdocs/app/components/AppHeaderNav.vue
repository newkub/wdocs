<script setup lang="ts">
const { wdocs: _wdocs } = useAppConfig();
const _openDropdown = ref<string | null>(null);
</script>

<template>
	<nav v-if="_wdocs.header" class="hidden md:flex gap-2">
		<div v-for="item in _wdocs.header.nav" :key="item.text" class="relative">
			<NuxtLink
				v-if="item.link"
				:to="item.link"
				class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
			>
				{{ item.text }}
			</NuxtLink>
			<button
				v-else
				@mouseover="_openDropdown = item.text"
				@mouseleave="_openDropdown = null"
				class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
			>
				{{ item.text }}
				<Icon name="mdi:chevron-down" class="w-4 h-4" />
			</button>
			<div
				v-if="!item.link && item.items && _openDropdown === item.text"
				@mouseover="_openDropdown = item.text"
				@mouseleave="_openDropdown = null"
				class="absolute top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20 py-1"
			>
				<NuxtLink
					v-for="subItem in item.items"
					:key="subItem.link"
					:to="subItem.link"
					class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					{{ subItem.text }}
				</NuxtLink>
			</div>
		</div>
	</nav>
</template>
