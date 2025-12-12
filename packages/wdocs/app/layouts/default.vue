<template>
	<div>
		<Navbar />
		<div class="flex">
			<Sidebar />
			<main class="flex-1 p-6 prose dark:prose-invert max-w-none">
				<slot />
			</main>
			<TOC />
		</div>
	</div>
</template>
