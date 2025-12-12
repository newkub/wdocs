import { Effect } from "effect";
import { newCommand, writeCommand } from "./app";
import { cac } from "./lib/cac.lib";
import { clack } from "./lib/clack.lib";

const cli = cac("wrikka");

cli.command("new", "Create a new project").action(() => {
	Effect.runPromise(newCommand).catch(console.error);
});

cli
	.command("write [content]", "Write something")
	.option("--ai", "Use AI mode")
	.action((content, options) => {
		const mode = options.ai ? "ai" : "normal";
		Effect.runPromise(writeCommand(content, mode)).catch(console.error);
	});

cli.help();
cli.version("0.1.0");

try {
	cli.parse();
} catch (e) {
	if (e instanceof Error) {
		clack.log.error(e.message);
	}
	process.exit(1);
}
