import benny from "benny";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { spawn } from "child_process";
import {
	render as markdownRsRender,
	renderFast as markdownRsRenderFast,
} from "../index.js";
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
	const mdIt = new MarkdownIt();
	const remarkable = new Remarkable();
	const showdownConverter = new showdown.Converter();
	const sample = readFileSync(path.resolve(BENCHES_DIR, "sample.md"), "utf-8");

	return new Promise((resolve) => {
		benny.suite(
			"JavaScript Markdown Parsers",
			benny.add("markdown-rs", () => markdownRsRender(sample)),
			benny.add("markdown-rs-fast", () => markdownRsRenderFast(sample)),
			benny.add("marked", () => marked(sample)),
			benny.add("markdown-it", () => mdIt.render(sample)),
			benny.add("remarkable", () => remarkable.render(sample)),
			benny.add("showdown", () => showdownConverter.makeHtml(sample)),
			benny.add("pulldown-cmark-wasm", () => pulldownCmarkParse(sample)),
			benny.add("comrak", () => comrakParse(sample)),
			benny.cycle(),
			benny.complete((summary) => {
				resolve(summary.results);
			}),
		);
	});
}

async function runRustBenchmarks() {
	console.log("Running Rust benchmarks...");
	const hyperfineOutput = path.resolve(
		BENCHES_DIR,
		"rust-hyperfine-results.json",
	);
	try {
		// Diagnostic step to check if hyperfine can be spawned
		await new Promise((resolve, reject) => {
			console.log("Attempting to spawn hyperfine with --version...");
			const testProc = spawn("bunx", ["hyperfine", "--version"], {
				shell: true,
				stdio: "inherit",
			});
			testProc.on("error", (err) =>
				reject(new Error(`Failed to spawn hyperfine process: ${err.message}`)),
			);
			testProc.on("close", (code) => {
				if (code === 0) {
					console.log("Hyperfine version check successful.");
					resolve();
				} else {
					reject(
						new Error(`Hyperfine version check failed with exit code ${code}.`),
					);
				}
			});
		});

		// If the above was successful, run the actual benchmark
		console.log("Running main Rust benchmark command...");
		await new Promise((resolve, reject) => {
			const benchProc = spawn(
				"bunx",
				[
					"hyperfine",
					"--warmup",
					"3",
					"--export-json",
					hyperfineOutput,
					"cargo run --release --quiet --bench markdown_bench -- --bench",
				],
				{ shell: true, stdio: "inherit" },
			);
			benchProc.on("error", (err) =>
				reject(new Error(`Failed to spawn benchmark process: ${err.message}`)),
			);
			benchProc.on("close", (code) => {
				if (code === 0) {
					resolve();
				} else {
					reject(new Error(`Benchmark process exited with code ${code}`));
				}
			});
		});

		const hyperfineData = JSON.parse(readFileSync(hyperfineOutput, "utf-8"));

		return hyperfineData.results.map((result) => ({
			name: result.command.split(" ")[5], // Extract benchmark name
			ops: 1 / result.mean,
			margin: result.stddev,
		}));
	} catch (error) {
		console.error("Failed to run Rust benchmarks:", error);
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
