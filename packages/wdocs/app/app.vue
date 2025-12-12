<template>
	<div class="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
		<Navbar />
		<div class="flex">
			<Sidebar />
			<main class="flex-1 p-8">
				<NuxtPage />
			</main>
		</div>
	</div>
</template>
