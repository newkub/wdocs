import { Effect } from "effect";
import { clack } from "../lib/clack.lib";

export const promptForContent = Effect.tryPromise(() =>
	clack.text({
		message: "What do you want to write?",
		placeholder: "Enter your content here",
	})
).pipe(
	Effect.flatMap((input) => {
		if (clack.isCancel(input)) {
			return Effect.fail("Operation cancelled");
		}
		return Effect.succeed(input);
	}),
);
