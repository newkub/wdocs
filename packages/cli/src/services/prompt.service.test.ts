import * as clack from "@clack/prompts";
import { Effect } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { promptForContent } from "./prompt.service";

vi.mock("@clack/prompts", () => ({
	text: vi.fn(),
	isCancel: vi.fn(),
	cancel: vi.fn(),
}));

describe("Write component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return content on successful prompt", async () => {
		(clack.text as vi.Mock).mockResolvedValue("test content");

		const result = await Effect.runPromise(promptForContent);

		expect(result).toBe("test content");
		expect(clack.text).toHaveBeenCalledOnce();
	});

	it("should fail if prompt is cancelled", async () => {
		(clack.isCancel as vi.Mock).mockReturnValueOnce(true);

		const effect = promptForContent;

		await expect(Effect.runPromise(effect)).rejects.toThrow("Operation cancelled");
	});
});
