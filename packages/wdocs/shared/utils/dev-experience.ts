import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface DiagnosticInfo {
	timestamp: string;
	nodeVersion: string;
	npmVersion?: string;
	bunVersion?: string;
	environment: string;
	workspace: string;
	dependencies: Record<string, string>;
	devDependencies: Record<string, string>;
}

export interface HotReloadEvent {
	type: "file" | "config" | "content";
	path: string;
	timestamp: number;
}

export class DevExperienceManager {
	private diagnosticCache: DiagnosticInfo | null = null;
	private hotReloadListeners: Set<(event: HotReloadEvent) => void> = new Set();

	async getDiagnostics(): Promise<DiagnosticInfo> {
		if (this.diagnosticCache) {
			return this.diagnosticCache;
		}

		const nodeVersion = process.version;
		let npmVersion: string | undefined;
		let bunVersion: string | undefined;

		try {
			const { stdout } = await execAsync("npm --version");
			npmVersion = stdout.trim();
		} catch {
			npmVersion = undefined;
		}

		try {
			const { stdout } = await execAsync("bun --version");
			bunVersion = stdout.trim();
		} catch {
			bunVersion = undefined;
		}

		const packageJson = await this.readPackageJson();

		this.diagnosticCache = {
			timestamp: new Date().toISOString(),
			nodeVersion,
			npmVersion,
			bunVersion,
			environment: process.env.NODE_ENV || "development",
			workspace: process.cwd(),
			dependencies: packageJson.dependencies || {},
			devDependencies: packageJson.devDependencies || {},
		};

		return this.diagnosticCache;
	}

	private async readPackageJson(): Promise<
		{ dependencies?: Record<string, string>; devDependencies?: Record<string, string> }
	> {
		try {
			const { readFile } = await import("node:fs/promises");
			const { resolve } = await import("node:path");
			const content = await readFile(resolve(process.cwd(), "package.json"), "utf-8");
			return JSON.parse(content);
		} catch {
			return {};
		}
	}

	printDiagnostics(): void {
		void this.getDiagnostics().then((diag) => {
			console.log("=".repeat(50));
			console.log("WDocs Development Diagnostics");
			console.log("=".repeat(50));
			console.log(`Timestamp: ${diag.timestamp}`);
			console.log(`Environment: ${diag.environment}`);
			console.log(`Workspace: ${diag.workspace}`);
			console.log(`Node: ${diag.nodeVersion}`);
			if (diag.bunVersion) console.log(`Bun: ${diag.bunVersion}`);
			if (diag.npmVersion) console.log(`NPM: ${diag.npmVersion}`);
			console.log("Dependencies:", Object.keys(diag.dependencies).length);
			console.log("DevDependencies:", Object.keys(diag.devDependencies).length);
			console.log("=".repeat(50));
		});
	}

	setupHotReload(): void {
		if (typeof window === "undefined") return;

		if (process.env.NODE_ENV === "development") {
			console.log("[Dev] Hot reload enabled");

			window.addEventListener("beforeunload", () => {
				this.notifyHotReloadListeners({
					type: "file",
					path: window.location.pathname,
					timestamp: Date.now(),
				});
			});
		}
	}

	onHotReload(listener: (event: HotReloadEvent) => void): () => void {
		this.hotReloadListeners.add(listener);
		return () => this.hotReloadListeners.delete(listener);
	}

	private notifyHotReloadListeners(event: HotReloadEvent): void {
		this.hotReloadListeners.forEach((listener) => listener(event));
	}

	async checkDependencies(): Promise<
		Array<{ name: string; status: "ok" | "outdated" | "missing"; current?: string; latest?: string }>
	> {
		const diag = await this.getDiagnostics();
		const results: Array<{ name: string; status: "ok" | "outdated" | "missing"; current?: string; latest?: string }> =
			[];

		const allDeps = { ...diag.dependencies, ...diag.devDependencies };

		for (const [name, version] of Object.entries(allDeps)) {
			try {
				const proc = Bun.spawn(["npm", "view", name, "version"]);
				const text = await new Response(proc.stdout).text();
				const latest = text.trim();
				await proc.exited;

				const currentVersion = version.replace(/^[\^~]/, "");

				results.push({
					name,
					status: currentVersion === latest ? "ok" : "outdated",
					current: currentVersion,
					latest,
				});
			} catch {
				results.push({
					name,
					status: "missing",
					current: version,
				});
			}
		}

		return results;
	}

	async runLint(): Promise<{ success: boolean; output: string }> {
		try {
			const proc = Bun.spawn(["bun", "run", "lint"]);
			const stdout = await new Response(proc.stdout).text();
			const stderr = await new Response(proc.stderr).text();
			await proc.exited;
			return {
				success: proc.exitCode === 0,
				output: stdout || stderr,
			};
		} catch (error: any) {
			return {
				success: false,
				output: error.message,
			};
		}
	}

	async runTypeCheck(): Promise<{ success: boolean; output: string }> {
		try {
			const proc = Bun.spawn(["bun", "run", "verify"]);
			const stdout = await new Response(proc.stdout).text();
			const stderr = await new Response(proc.stderr).text();
			await proc.exited;
			return {
				success: proc.exitCode === 0,
				output: stdout || stderr,
			};
		} catch (error: any) {
			return {
				success: false,
				output: error.message,
			};
		}
	}

	async runTests(): Promise<{ success: boolean; output: string }> {
		try {
			const proc = Bun.spawn(["bun", "run", "test"]);
			const stdout = await new Response(proc.stdout).text();
			const stderr = await new Response(proc.stderr).text();
			await proc.exited;
			return {
				success: proc.exitCode === 0,
				output: stdout || stderr,
			};
		} catch (error: any) {
			return {
				success: false,
				output: error.message,
			};
		}
	}

	async buildProject(): Promise<{ success: boolean; output: string }> {
		try {
			const proc = Bun.spawn(["bun", "run", "build"]);
			const stdout = await new Response(proc.stdout).text();
			const stderr = await new Response(proc.stderr).text();
			await proc.exited;
			return {
				success: proc.exitCode === 0,
				output: stdout || stderr,
			};
		} catch (error: any) {
			return {
				success: false,
				output: error.message,
			};
		}
	}

	clearCache(): void {
		this.diagnosticCache = null;
	}

	getDevCommands(): Record<string, string> {
		return {
			dev: "Start development server",
			build: "Build for production",
			preview: "Preview production build",
			lint: "Run linter",
			test: "Run tests",
			"test:coverage": "Run tests with coverage",
			verify: "Run type check",
			format: "Format code",
		};
	}

	printDevCommands(): void {
		const commands = this.getDevCommands();
		console.log("Available commands:");
		for (const [cmd, desc] of Object.entries(commands)) {
			console.log(`  bun run ${cmd.padEnd(20)} - ${desc}`);
		}
	}
}

export const devExperienceManager = new DevExperienceManager();
