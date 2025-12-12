import { Effect } from "effect";

export const createProject = (name: string, type: string) =>
	Effect.gen(function*() {
		yield* Effect.log(`Creating project: ${name} (${type})`);
		// Simulate project creation
		yield* Effect.sleep("2 seconds");
		yield* Effect.log("Project created successfully!");
		return { name, type };
	});
