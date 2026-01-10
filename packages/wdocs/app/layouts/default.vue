<template>
	<div class="bg-white dark:bg-slate-900">
		<Header />
		<div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="lg:flex">
				<!-- Desktop Sidebar -->
				<aside class="hidden lg:block w-64 flex-shrink-0">
					<div class="h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto py-8 pr-4 border-r border-gray-200 dark:border-gray-700">
						<SideBar />
					</div>
				</aside>

				<!-- Main Content with Right Sidebar -->
				<div class="lg:flex flex-1">
					<main class="py-8 w-full lg:w-[calc(100%-32rem)]">
						<div class="max-w-3xl mx-auto xl:max-w-none xl:ml-0 xl:mr-64">
							<slot />
						</div>
					</main>

					<!-- Right Sidebar (TOC) - Placeholder -->
					<aside class="hidden xl:block w-96 flex-shrink-0">
						<div class="h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto py-8 pl-8">
							<slot name="aside">
								<TableOfContents />
							</slot>
						</div>
					</aside>
				</div>
			</div>
		</div>

		<!-- Mobile Sidebar (Drawer) -->
		<Transition name="slide-fade">
			<div v-if="_isMobileNavOpen" class="lg:hidden fixed inset-0 z-50">
				<!-- Backdrop -->
				<div
					class="absolute inset-0 bg-black/20 backdrop-blur-sm"
					@click="mobileNav.toggle()"
				>
				</div>
				<!-- Panel -->
				<div class="relative h-full w-80 max-w-[calc(100%-3rem)] bg-white dark:bg-slate-800 p-4 shadow-lg">
					<SideBar />
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
const mobileNav = useMobileNav();
const { isMobileNavOpen: _isMobileNavOpen } = mobileNav;
</script>

<style>
/* Transitions for mobile sidebar */
.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: opacity 0.3s ease;
}
.slide-fade-enter-active .relative,
.slide-fade-leave-active .relative {
	transition: transform 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
	opacity: 0;
}
.slide-fade-enter-from .relative,
.slide-fade-leave-to .relative {
	transform: translateX(-100%);
}
</style>
