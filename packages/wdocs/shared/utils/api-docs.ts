import type { ApiParameter, ApiResponse, Frontmatter } from "../../shared/types";

export interface ApiEndpoint {
	method: string;
	path: string;
	title?: string;
	description?: string;
	parameters: ApiParameter[];
	responses: Record<string, ApiResponse>;
}

export interface ApiTestRequest {
	method: string;
	path: string;
	parameters?: Record<string, unknown>;
	body?: unknown;
	headers?: Record<string, string>;
}

export interface ApiTestResponse {
	status: number;
	statusText: string;
	headers: Record<string, string>;
	data: unknown;
	duration: number;
}

export class ApiDocumentationManager {
	parseApiFrontmatter(frontmatter: Frontmatter): ApiEndpoint | null {
		if (!frontmatter.api || !frontmatter.method || !frontmatter.path) {
			return null;
		}

		return {
			method: frontmatter.method.toUpperCase(),
			path: frontmatter.path,
			title: frontmatter.title,
			description: frontmatter.description,
			parameters: frontmatter.parameters || [],
			responses: frontmatter.responses || {},
		};
	}

	generateCurlCommand(request: ApiTestRequest, baseUrl: string = ""): string {
		const { method, path, parameters, body, headers } = request;

		let curl = `curl -X ${method} "${baseUrl}${path}"`;

		if (headers) {
			Object.entries(headers).forEach(([key, value]) => {
				curl += ` -H "${key}: ${value}"`;
			});
		}

		if (body && ["POST", "PUT", "PATCH"].includes(method)) {
			curl += ` -H "Content-Type: application/json"`;
			curl += ` -d '${JSON.stringify(body)}'`;
		}

		if (parameters && Object.keys(parameters).length > 0) {
			const params = new URLSearchParams();
			Object.entries(parameters).forEach(([key, value]) => {
				params.append(key, String(value));
			});
			curl += `?${params.toString()}`;
		}

		return curl;
	}

	async testRequest(request: ApiTestRequest, baseUrl: string = ""): Promise<ApiTestResponse> {
		const startTime = performance.now();

		try {
			const url = new URL(path, baseUrl);

			if (request.parameters) {
				Object.entries(request.parameters).forEach(([key, value]) => {
					url.searchParams.append(key, String(value));
				});
			}

			const headers: HeadersInit = {
				"Content-Type": "application/json",
				...request.headers,
			};

			const options: RequestInit = {
				method: request.method,
				headers,
			};

			if (request.body && ["POST", "PUT", "PATCH"].includes(request.method)) {
				options.body = JSON.stringify(request.body);
			}

			const response = await fetch(url.toString(), options);
			const duration = performance.now() - startTime;

			const responseHeaders: Record<string, string> = {};
			response.headers.forEach((value, key) => {
				responseHeaders[key] = value;
			});

			let data: unknown;
			const contentType = response.headers.get("content-type");
			if (contentType?.includes("application/json")) {
				data = await response.json();
			} else {
				data = await response.text();
			}

			return {
				status: response.status,
				statusText: response.statusText,
				headers: responseHeaders,
				data,
				duration,
			};
		} catch (error) {
			const duration = performance.now() - startTime;
			return {
				status: 0,
				statusText: "Network Error",
				headers: {},
				data: error instanceof Error ? error.message : String(error),
				duration,
			};
		}
	}

	validateParameters(parameters: ApiParameter[], values: Record<string, unknown>): { valid: boolean; errors: string[] } {
		const errors: string[] = [];

		for (const param of parameters) {
			if (param.required && !(param.name in values)) {
				errors.push(`Parameter "${param.name}" is required`);
				continue;
			}

			const value = values[param.name];

			if (value !== undefined && value !== null) {
				if (param.schema.type === "string" && typeof value !== "string") {
					errors.push(`Parameter "${param.name}" must be a string`);
				}

				if (param.schema.type === "number" && typeof value !== "number") {
					errors.push(`Parameter "${param.name}" must be a number`);
				}

				if (param.schema.type === "boolean" && typeof value !== "boolean") {
					errors.push(`Parameter "${param.name}" must be a boolean`);
				}
			}
		}

		return {
			valid: errors.length === 0,
			errors,
		};
	}

	generateOpenApiSpec(endpoints: ApiEndpoint[], info: { title: string; version: string }): object {
		const paths: Record<string, object> = {};

		for (const endpoint of endpoints) {
			const pathItem: Record<string, object> = {
				[endpoint.method.toLowerCase()]: {
					summary: endpoint.title || endpoint.path,
					description: endpoint.description,
					parameters: endpoint.parameters.map((param) => ({
						name: param.name,
						in: param.in,
						description: param.description,
						required: param.required ?? false,
						schema: {
							type: param.schema.type,
							default: param.schema.default,
						},
					})),
					responses: endpoint.responses,
				},
			};

			paths[endpoint.path] = pathItem;
		}

		return {
			openapi: "3.0.0",
			info,
			paths,
		};
	}
}

export const apiDocumentationManager = new ApiDocumentationManager();
