import { Bench } from "tinybench";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { execa } from "execa";
import { renderGfm as markdownRsRender } from "../index.js";
import { marked } from "marked";
import MarkdownIt from "markdown-it";
import { Remarkable } from "remarkable";
import showdown from "showdown";
import { format as pulldownCmarkParse } from "pulldown-cmark-wasm";
import { markdownToHTML as comrakParse } from "comrak";

const BENCHES_DIR = path.resolve(process.cwd(), "benches");
const RESULTS_FILE = path.resolve(BENCHES_DIR, "results.json");

async function runJSBenchmarks() {
	console.log("Running JavaScript benchmarks...");
	const bench = new Bench({ time: 100 });
	const mdIt = new MarkdownIt();
	const remarkable = new Remarkable();
	const showdownConverter = new showdown.Converter();
	const sample = readFileSync(path.resolve(BENCHES_DIR, "sample.md"), "utf-8");

	bench
		.add("markdown-rs", () => markdownRsRender(sample))
		.add("marked", () => marked(sample))
		.add("markdown-it", () => mdIt.render(sample))
		.add("remarkable", () => remarkable.render(sample))
		.add("showdown", () => showdownConverter.makeHtml(sample))
		.add("pulldown-cmark-wasm", () => pulldownCmarkParse(sample))
		.add("comrak", () => comrakParse(sample));

	await bench.run();

	return bench.table().map((result) => ({
		name: result.Task,
		ops: parseFloat(result["ops/sec"]),
		margin: parseFloat(result.Margin),
	}));
}

async function runRustBenchmarks() {
	console.log("Running Rust benchmarks...");
	const hyperfineOutput = path.resolve(
		BENCHES_DIR,
		"rust-hyperfine-results.json",
	);
	try {
		console.log("Checking hyperfine version...");
		await execa("hyperfine", ["--version"], { stdio: "inherit" });

		console.log("Running main Rust benchmark command...");
		await execa(
			"hyperfine",
			["--warmup", "3", "--export-json", hyperfineOutput, "bun run bench:rust"],
			{ stdio: "inherit" },
		);

		const hyperfineData = JSON.parse(readFileSync(hyperfineOutput, "utf-8"));

		return hyperfineData.results.map((result) => ({
			name: result.command.split(" ")[2], // Adjusted for 'bun run bench:rust'
			ops: 1 / result.mean,
			margin: result.stddev,
		}));
	} catch (error) {
		console.error("Failed to run Rust benchmarks:", error.message);
		return [];
	}
}

async function main() {
	const jsResults = await runJSBenchmarks();
	const rustResults = await runRustBenchmarks();

	const allResults = {
		js: {
			name: "JavaScript Markdown Parsers",
			results: jsResults,
		},
		rust: {
			name: "Rust Markdown Parsers",
			results: rustResults,
		},
	};

	writeFileSync(RESULTS_FILE, JSON.stringify(allResults, null, 2));
	console.log(`All benchmark results saved to ${RESULTS_FILE}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
