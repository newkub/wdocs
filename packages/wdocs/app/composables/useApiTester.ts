import { computed, ref } from "vue";
import type { ApiParameter } from "~/shared/types";

interface ApiResponse {
	status: number;
	data: unknown;
}

export function useApiTester(props: {
	method: string;
	path: string;
	parameters?: ApiParameter[];
}) {
	const baseUrl = ref("https://api.example.com"); // This should be configurable
	const authToken = ref("");
	const response = ref<ApiResponse | null>(null);
	const loading = ref(false);
	const formValues = ref<Record<string, string>>({});

	const finalPath = computed(() => {
		let tempPath = props.path;
		if (props.parameters) {
			for (const param of props.parameters) {
				if (param.in === "path" && formValues.value[param.name]) {
					tempPath = tempPath.replace(
						`{${param.name}}`,
						formValues.value[param.name] || "",
					);
				}
			}
		}
		return tempPath;
	});

	const curlCommand = computed(() => {
		let command = `curl -X ${props.method} '${baseUrl.value}${finalPath.value}'`;
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};
		if (authToken.value) {
			headers.Authorization = `Bearer ${authToken.value}`;
		}
		for (const key in headers) {
			command += ` \
    -H '${key}: ${headers[key]}'`;
		}
		return command;
	});

	async function testRequest() {
		loading.value = true;
		response.value = null;
		try {
			const res = await $fetch(`${baseUrl.value}${finalPath.value}`, {
				method: props.method as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
				headers: authToken.value
					? { Authorization: `Bearer ${authToken.value}` }
					: {},
				params: props.parameters
					?.filter((p) => p.in === "query")
					.reduce(
						(acc, p) => {
							const value = formValues.value[p.name];
							if (value) acc[p.name] = value;
							return acc;
						},
						{} as Record<string, string>,
					),
			});
			response.value = { status: 200, data: res };
		} catch (error: unknown) {
			if (error instanceof Error && "response" in error) {
				const fetchError = error as {
					response?: { status: number; _data: unknown };
				};
				response.value = {
					status: fetchError.response?.status || 500,
					data: fetchError.response?._data || "An unexpected error occurred",
				};
			} else {
				response.value = {
					status: 500,
					data: "An unexpected error occurred",
				};
			}
		}
		loading.value = false;
	}

	return {
		baseUrl,
		authToken,
		response,
		loading,
		formValues,
		finalPath,
		curlCommand,
		testRequest,
	};
}
