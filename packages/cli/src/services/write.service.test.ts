import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { writeToFile } from "./write.service";

describe("write.service", () => {
	it("should write in normal mode", async () => {
		const result = await Effect.runPromise(writeToFile("hello", "normal"));
		expect(result).toBe("Normal Write: hello");
	});

	it("should write in ai mode", async () => {
		const result = await Effect.runPromise(writeToFile("hello", "ai"));
		expect(result).toBe("AI Processed: hello");
	});
});
