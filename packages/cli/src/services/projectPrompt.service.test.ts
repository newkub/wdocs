import * as clack from "@clack/prompts";
import { Effect } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { promptForProjectDetails } from "./projectPrompt.service";

vi.mock("@clack/prompts", () => ({
	intro: vi.fn(),
	outro: vi.fn(),
	text: vi.fn(),
	select: vi.fn(),
	confirm: vi.fn(),
	isCancel: vi.fn(),
	cancel: vi.fn(),
	spinner: vi.fn(() => ({ start: vi.fn(), stop: vi.fn() })),
	log: {
		error: vi.fn(),
	},
}));

describe("NewProject component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return project details on successful prompts", async () => {
		(clack.text as vi.Mock).mockResolvedValue("test-project");
		(clack.select as vi.Mock).mockResolvedValue("web");
		(clack.confirm as vi.Mock).mockResolvedValue(true);

		const result = await Effect.runPromise(promptForProjectDetails);

		expect(result).toEqual({ project: "test-project", projectType: "web" });
		expect(clack.text).toHaveBeenCalledOnce();
		expect(clack.select).toHaveBeenCalledOnce();
		expect(clack.confirm).toHaveBeenCalledOnce();
	});

	it("should fail if text prompt is cancelled", async () => {
		(clack.isCancel as vi.Mock).mockReturnValueOnce(true);

		const effect = promptForProjectDetails;

		await expect(Effect.runPromise(effect)).rejects.toThrow("Operation cancelled");
	});
});
