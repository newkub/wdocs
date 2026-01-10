export interface EditPageConfig {
	repo: string;
	branch: string;
	dir: string;
	text: string;
}

export interface ContributionGuidelines {
	title: string;
	description: string;
	steps: string[];
	codeOfConduct?: string;
}

export interface LastUpdatedInfo {
	date: Date;
	author: string;
	commit: string;
	message: string;
}

export class CollaborationManager {
	private config: EditPageConfig | null = null;

	constructor(config?: EditPageConfig) {
		if (config) {
			this.config = config;
		}
	}

	setConfig(config: EditPageConfig): void {
		this.config = config;
	}

	getEditUrl(path: string): string | null {
		if (!this.config) return null;

		const { repo, branch, dir } = this.config;
		const filePath = `${dir}${path.replace(/^\//, "")}.md`;

		return `https://github.com/${repo}/edit/${branch}/${filePath}`;
	}

	getViewSourceUrl(path: string): string | null {
		if (!this.config) return null;

		const { repo, branch, dir } = this.config;
		const filePath = `${dir}${path.replace(/^\//, "")}.md`;

		return `https://github.com/${repo}/blob/${branch}/${filePath}`;
	}

	getIssueUrl(title: string, body?: string): string | null {
		if (!this.config) return null;

		const { repo } = this.config;
		const params = new URLSearchParams({
			title,
			body: body || "",
		});

		return `https://github.com/${repo}/issues/new?${params.toString()}`;
	}

	async getLastUpdated(filePath: string): Promise<LastUpdatedInfo | null> {
		try {
			const { simpleGit } = await import("simple-git");
			const git = simpleGit();

			const log = await git.log({ file: filePath, maxCount: 1 });

			if (log.all.length === 0) {
				return null;
			}

			const commit = log.all[0];

			return {
				date: new Date(commit.date),
				author: commit.author_name,
				commit: commit.hash,
				message: commit.message,
			};
		} catch (error) {
			console.warn("Failed to get last updated info:", error);
			return null;
		}
	}

	async getContributors(filePath: string, limit: number = 10): Promise<Array<{ name: string; commits: number; avatar?: string }>> {
		try {
			const { simpleGit } = await import("simple-git");
			const git = simpleGit();

			const log = await git.log({ file: filePath });

			const contributors = new Map<string, number>();

			for (const commit of log.all) {
				const name = commit.author_name;
				contributors.set(name, (contributors.get(name) || 0) + 1);
			}

			return Array.from(contributors.entries())
				.map(([name, commits]) => ({ name, commits }))
				.sort((a, b) => b.commits - a.commits)
				.slice(0, limit);
		} catch (error) {
			console.warn("Failed to get contributors:", error);
			return [];
		}
	}

	formatLastUpdated(info: LastUpdatedInfo, locale: string = "en"): string {
		const date = new Intl.DateTimeFormat(locale, {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(info.date);

		const templates: Record<string, string> = {
			en: `Last updated on ${date} by ${info.author}`,
			th: `อัปเดตล่าสุดเมื่อ ${date} โดย ${info.author}`,
			ja: `${date}に${info.author}によって更新されました`,
			zh: `最后更新于${date}，由${info.author}更新`,
			ko: `${date}에 ${info.author}님이 업데이트함`,
		};

		return templates[locale] || templates.en;
	}

	getDefaultGuidelines(): ContributionGuidelines {
		return {
			title: "Contributing to Documentation",
			description: "We welcome contributions to our documentation! Here's how you can help:",
			steps: [
				"Fork the repository on GitHub",
				"Create a new branch for your changes",
				"Make your changes to the markdown files",
				"Test your changes locally",
				"Commit your changes with a clear message",
				"Push to your fork and submit a pull request",
			],
			codeOfConduct: "Please be respectful and constructive in all interactions.",
		};
	}

	async createIssueFromPage(path: string, issueType: "typo" | "content" | "technical" | "other", description?: string): Promise<string | null> {
		if (!this.config) return null;

		const titles: Record<string, string> = {
			typo: `Typo in ${path}`,
			content: `Content issue in ${path}`,
			technical: `Technical issue in ${path}`,
			other: `Issue in ${path}`,
		};

		const body = description
			? `**Issue Type:** ${issueType}\n\n**Description:**\n${description}\n\n**Page:** ${path}`
			: `**Issue Type:** ${issueType}\n\n**Page:** ${path}`;

		return this.getIssueUrl(titles[issueType], body);
	}

	generateEditButtonProps(path: string): {
		href: string | null;
		text: string;
		ariaLabel: string;
	} | null {
		if (!this.config) return null;

		return {
			href: this.getEditUrl(path),
			text: this.config.text,
			ariaLabel: `Edit this page on GitHub`,
		};
	}
}

export const collaborationManager = new CollaborationManager();
