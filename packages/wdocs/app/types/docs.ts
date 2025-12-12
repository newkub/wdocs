export interface NavigationItem {
	_path: string;
	title: string;
	children?: NavigationItem[];
}

export interface SearchResult {
	path: string;
	title: string;
}
