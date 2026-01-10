<template>
	<div class="flex flex-col h-screen">
		<AppHeader />
		<main class="p-4 overflow-y-auto">
			<slot name="before-content" />
			<slot />
			<slot name="after-content" />
		</main>
	</div>
</template>
