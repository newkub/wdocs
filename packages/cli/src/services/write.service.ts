import { Effect } from "effect";

export const writeToFile = (content: string, mode: "normal" | "ai") =>
	Effect.gen(function*() {
		if (mode === "ai") {
			yield* Effect.log("AI processing content...");
			return `AI Processed: ${content}`;
		}
		return `Normal Write: ${content}`;
	});
