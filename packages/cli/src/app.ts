import { Console, Effect } from "effect";
import { promptForContent } from "./services/prompt.service";
import { promptForProjectDetails } from "./services/projectPrompt.service";
import { clack } from "./lib/clack.lib";
import { createProject } from "./services/project.service";
import { writeToFile } from "./services/write.service";

export const newCommand = Effect.gen(function*() {
	const details = yield* Effect.catchAll(promptForProjectDetails, (msg) => {
		clack.cancel(msg);
		return Effect.succeed(null);
	});

	if (!details) return;

	const spinner = clack.spinner();
	spinner.start("Creating project...");

	yield* createProject(details.project, details.projectType);

	spinner.stop("Project created!");
	clack.outro(`🎉 Project ready! Next steps:\n  cd ${details.project}\n  bun install\n  bun run dev`);
});

export const writeCommand = (content: string | undefined, mode: "normal" | "ai") =>
	Effect.gen(function*() {
		let writeContent = content;
		if (!writeContent) {
			const result = yield* Effect.catchAll(promptForContent, (msg) => {
				clack.cancel(msg);
				return Effect.succeed(null);
			});
			if (result === null) return;
			writeContent = result;
		}

		const output = yield* writeToFile(writeContent, mode);
		yield* Console.log(output);
	});
