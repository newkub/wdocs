import { Effect } from "effect";
import { clack } from "../lib/clack.lib";

export const promptForProjectDetails = Effect.gen(function*() {
	clack.intro("🚀 Create new project");

	const project = yield* Effect.tryPromise(() =>
		clack.text({
			message: "Project name?",
			placeholder: "my-project",
			validate: (value) => {
				if (!value) return "Project name is required!";
				if (!/^[a-z0-9-]+$/.test(value)) return "Use only lowercase, numbers and hyphens";
			},
		})
	);

	if (clack.isCancel(project)) {
		return yield* Effect.fail("Operation cancelled");
	}

	const projectType = yield* Effect.tryPromise(() =>
		clack.select({
			message: "Select project type",
			options: [
				{ value: "web", label: "Web Application" },
				{ value: "api", label: "API Server" },
				{ value: "lib", label: "Library" },
			],
		})
	);

	if (clack.isCancel(projectType)) {
		return yield* Effect.fail("Operation cancelled");
	}

	const confirm = yield* Effect.tryPromise(() =>
		clack.confirm({
			message: `Create ${project} as ${projectType} project?`,
		})
	);

	if (!confirm || clack.isCancel(confirm)) {
		return yield* Effect.fail("Operation cancelled");
	}

	return { project, projectType };
});
