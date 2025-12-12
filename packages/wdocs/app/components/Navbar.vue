<script setup lang="ts">
import { useDocSearch } from "~/composables/docs";

const { searchQuery, searchResults, isSearchOpen, closeSearch } =
	useDocSearch();

const handleBlur = () => {
	// Delay closing to allow click event on search results
	setTimeout(() => {
		closeSearch();
	}, 200);
};
</script>

<template>
	<nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center">
					<NuxtLink
						to="/"
						class="text-2xl font-bold text-gray-900 dark:text-white"
					>Wrikka Docs</NuxtLink>
				</div>
				<div class="flex items-center space-x-4">
					<div class="relative">
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search docs..."
							class="input w-64"
							@blur="handleBlur"
						/>
						<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
							<i class="i-mdi-magnify text-gray-400"></i>
						</div>
						<div
							v-if="isSearchOpen && searchResults.length"
							class="absolute mt-1 w-64 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10"
						>
							<ul>
								<li v-for="result in searchResults" :key="result.path">
									<NuxtLink
										:to="result.path"
										@click="closeSearch"
										class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
									>{{ result.title }}</NuxtLink>
								</li>
							</ul>
						</div>
					</div>
					<ThemeSwitcher />
				</div>
			</div>
		</div>
	</nav>
</template>
