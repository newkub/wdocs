<script setup lang="ts">
const _mobileNav = useMobileNav();
</script>

<template>
	<header class="h-16 sticky top-0 z-50 bg-white/75 dark:bg-gray-800/75 backdrop-blur-lg shadow-sm">
		<div class="container mx-auto flex items-center justify-between h-full px-4 sm:px-6 md:px-8">
			<div class="flex items-center space-x-4">
				<button class="md:hidden" @click="_mobileNav.toggle">
					<Icon
						:name="_mobileNav.isMobileNavOpen
						? 'heroicons:x-mark-20-solid'
						: 'heroicons:bars-3-20-solid'"
						class="w-6 h-6"
					/>
				</button>
				<NuxtLink
					to="/"
					class="text-xl font-bold text-gray-900 dark:text-white"
				>
					wdocs
				</NuxtLink>
			</div>
			<div class="flex items-center space-x-4">
				<Search />
				<ThemeToggle />
				<SocialLinks />
			</div>
		</div>
	</header>
</template>
