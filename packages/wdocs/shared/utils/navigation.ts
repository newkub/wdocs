import type { NavItem, ContentItem } from "../../shared/types";

export interface BreadcrumbItem {
	title: string;
	link: string;
}

export class NavigationManager {
	private sidebarCache = new Map<string, NavItem[]>();

	generateSidebar(contentItems: ContentItem[], basePath: string): NavItem[] {
		const cacheKey = basePath;

		if (this.sidebarCache.has(cacheKey)) {
			return this.sidebarCache.get(cacheKey)!;
		}

		const filtered = contentItems.filter((item) =>
			item.slug.startsWith(basePath)
		);

		const sidebar = this.buildTree(filtered, basePath);
		this.sidebarCache.set(cacheKey, sidebar);

		return sidebar;
	}

	private buildTree(items: ContentItem[], basePath: string): NavItem[] {
		const tree: NavItem[] = [];
		const map = new Map<string, NavItem>();

		for (const item of items) {
			const parts = item.slug.replace(basePath, "").split("/").filter(Boolean);
			const navItem: NavItem = {
				text: item.title,
				link: item.slug,
				icon: (item as any).icon,
				order: (item as any).order,
			};

			map.set(item.slug, navItem);

			if (parts.length === 1) {
				tree.push(navItem);
			} else {
				const parentPath = `${basePath}${parts.slice(0, -1).join("/")}`;
				const parent = map.get(parentPath);

				if (parent) {
					if (!parent.items) {
						parent.items = [];
					}
					parent.items.push(navItem);
				}
			}
		}

		return this.sortByOrder(tree);
	}

	private sortByOrder(items: NavItem[]): NavItem[] {
		return items.sort((a, b) => {
			const orderA = a.order ?? 999;
			const orderB = b.order ?? 999;
			return orderA - orderB;
		});
	}

	getActivePath(sidebar: NavItem[], currentPath: string): NavItem[] {
		const active: NavItem[] = [];

		const findActive = (items: NavItem[], path: string): NavItem | null => {
			for (const item of items) {
				if (item.link === path) {
					return item;
				}

				if (item.items) {
					const found = findActive(item.items, path);
					if (found) {
						return item;
					}
				}
			}
			return null;
		};

		const activeItem = findActive(sidebar, currentPath);
		if (activeItem) {
			active.push(activeItem);
		}

		return active;
	}

	generateBreadcrumbs(currentPath: string, sidebar: NavItem[]): BreadcrumbItem[] {
		const breadcrumbs: BreadcrumbItem[] = [];

		const parts = currentPath.split("/").filter(Boolean);

		let accumulatedPath = "";

		for (let i = 0; i < parts.length; i++) {
			accumulatedPath += `/${parts[i]}`;

			const title = this.findTitleByPath(sidebar, accumulatedPath) || parts[i];

			breadcrumbs.push({
				title,
				link: accumulatedPath,
			});
		}

		return breadcrumbs;
	}

	private findTitleByPath(items: NavItem[], path: string): string | null {
		for (const item of items) {
			if (item.link === path) {
				return item.text;
			}

			if (item.items) {
				const found = this.findTitleByPath(item.items, path);
				if (found) {
					return found;
				}
			}
		}
		return null;
	}

	getPrevNext(currentPath: string, sidebar: NavItem[]): { prev: NavItem | null; next: NavItem | null } {
		const flat = this.flatten(sidebar);
		const index = flat.findIndex((item) => item.link === currentPath);

		return {
			prev: index > 0 ? flat[index - 1] : null,
			next: index < flat.length - 1 ? flat[index + 1] : null,
		};
	}

	private flatten(items: NavItem[]): NavItem[] {
		const result: NavItem[] = [];

		const traverse = (navItems: NavItem[]) => {
			for (const item of navItems) {
				if (item.link) {
					result.push(item);
				}

				if (item.items) {
					traverse(item.items);
				}
			}
		};

		traverse(items);
		return result;
	}

	clearCache(): void {
		this.sidebarCache.clear();
	}
}

export const navigationManager = new NavigationManager();
