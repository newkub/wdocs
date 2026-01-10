<template>
	<div class="my-8 p-4 border rounded-lg">
		<div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
			<slot name="preview"></slot>
		</div>
		<div v-if="$slots.code" class="mt-4">
			<h4 class="font-semibold">Code</h4>
			<div class="mt-2 bg-gray-900 text-white p-4 rounded-lg overflow-x-auto">
				<slot name="code"></slot>
			</div>
		</div>
		<div v-if="$slots.props" class="mt-4">
			<h4 class="font-semibold">Props</h4>
			<div class="mt-2">
				<slot name="props"></slot>
			</div>
		</div>
	</div>
</template>
