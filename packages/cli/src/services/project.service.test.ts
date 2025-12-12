import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { createProject } from "./project.service";

describe("project.service", () => {
	it("should create a project", async () => {
		const result = await Effect.runPromise(createProject("test-project", "web"));
		expect(result).toEqual({ name: "test-project", type: "web" });
	});
});
