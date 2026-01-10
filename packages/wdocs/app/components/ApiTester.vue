```vue
<script setup lang="ts">
import { useApiTester } from "~/composables/useApiTester";
import type { ApiParameter } from "~/shared/types";

const props = defineProps<{
	method: string;
	path: string;
	parameters?: ApiParameter[];
}>();

const {
	baseUrl: _baseUrl,
	authToken: _authToken,
	response: _response,
	loading: _loading,
	formValues: _formValues,
	curlCommand: _curlCommand,
	testRequest: _testRequest,
} = useApiTester(props);
</script>

<template>
	<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 my-8">
		<ApiTesterCurlCommand :command="_curlCommand" />
		<ApiTesterForm
			v-model:baseUrl="_baseUrl"
			v-model:authToken="_authToken"
			v-model:formValues="_formValues"
			:parameters="parameters"
		/>

		<button
			@click="_testRequest"
			:disabled="_loading"
			class="mt-6 w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 disabled:bg-gray-400 font-semibold transition-colors"
		>
			{{ _loading ? "Sending..." : "Send Request" }}
		</button>

		<ApiTesterResponse :response="_response" />
	</div>
</template>
