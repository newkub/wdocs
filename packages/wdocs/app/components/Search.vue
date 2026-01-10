<script setup lang="ts">
import { useMagicKeys } from "@vueuse/core";
import { ref, watch } from "vue";
import { useSearch } from "~/composables/useSearch";

const isOpen = ref(false);
const { query, results: _results, loading: _loading } = useSearch();

const keys = useMagicKeys();
const CtrlK = keys["Ctrl+K"];
const Slash = keys["/"];

if (CtrlK) {
	watch(CtrlK, (v) => {
		if (v) isOpen.value = !isOpen.value;
	});
}

if (Slash) {
	watch(Slash, (v) => {
		if (v) {
			const activeEl = document.activeElement;
			if (activeEl?.tagName !== "INPUT" && activeEl?.tagName !== "TEXTAREA") {
				isOpen.value = true;
			}
		}
	});
}

function _closeModal() {
	isOpen.value = false;
}

watch(isOpen, (val) => {
	if (!val) {
		setTimeout(() => {
			query.value = "";
		}, 200); // delay to allow closing animation
	}
});
</script>

<template>
	<div>
		<button
			@click="isOpen = true"
			class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
		>
			<Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-500" />
			<span class="text-sm text-gray-500">Search...</span>
			<span
				class="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md"
			>Ctrl+K</span>
		</button>

		<Teleport to="body">
			<Transition name="search-modal">
				<div
					v-if="isOpen"
					class="fixed inset-0 z-50 flex items-start justify-center pt-20"
				>
					<div
						class="absolute inset-0 bg-black/30 backdrop-blur-sm"
						@click="_closeModal"
					>
					</div>
					<div class="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
						<div class="flex items-center border-b border-gray-200 dark:border-gray-700 p-4">
							<Icon
								name="heroicons:magnifying-glass"
								class="w-6 h-6 text-gray-500 mr-3"
							/>
							<input
								v-model="query"
								type="text"
								placeholder="Search documentation..."
								class="w-full bg-transparent focus:outline-none text-lg"
								autofocus
							/>
							<button
								@click="_closeModal"
								class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md"
							>
								ESC
							</button>
						</div>
						<div class="p-4 max-h-[60vh] overflow-y-auto">
							<div v-if="_loading" class="text-center py-8 text-gray-500">
								Loading...
							</div>
							<ul v-else-if="_results.length" class="space-y-2">
								<li v-for="result in _results" :key="result.path">
									<NuxtLink
										:to="result.path"
										@click="_closeModal"
										class="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
									>
										<h4 class="font-semibold text-primary-500 dark:text-primary-400">
											{{ result.title }}
										</h4>
										<p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
											{{ result.content }}
										</p>
									</NuxtLink>
								</li>
							</ul>
							<div v-else-if="query" class="text-center py-8 text-gray-500">
								No results found for "<strong>{{ query }}</strong>".
							</div>
							<div v-else class="text-center py-8 text-gray-500">
								Search for anything in the documentation.
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<style>
.search-modal-enter-active,
.search-modal-leave-active {
	transition: opacity 0.2s ease-in-out;
}
.search-modal-enter-active .relative,
.search-modal-leave-active .relative {
	transition: transform 0.2s ease-in-out;
}
.search-modal-enter-from,
.search-modal-leave-to {
	opacity: 0;
}
.search-modal-enter-from .relative,
.search-modal-leave-to .relative {
	transform: scale(0.95) translateY(-20px);
}
</style>
