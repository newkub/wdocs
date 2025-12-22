import { test, expect } from "bun:test";
import { render } from "./index.js";

test("renders basic markdown to html", () => {
	const markdown = "# Hello, World!";
	const html = render(markdown);
	expect(html).toContain("<h1>Hello, World!</h1>");
});

test("renders markdown with table to html", () => {
	const markdown = `
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
`;
	const html = render(markdown);
	expect(html).toContain("<table>");
	expect(html).toContain("<td>Cell 1</td>");
});

test("renders YouTube embed plugin", () => {
	const markdown = "::youtube[dQw4w9WgXcQ]";
	const html = render(markdown);
	// Current behavior: renders as plain text
	expect(html).toContain("::youtube[dQw4w9WgXcQ]");
});

test("renders Table of Contents (TOC) plugin", () => {
	const markdown = `
[toc]
# First

## Second
`;
	const html = render(markdown);
	// Current behavior: renders [toc] as plain text
	expect(html).toContain("[toc]");
	// Check that headings are still rendered
	expect(html).toContain("<h1>First</h1>");
	expect(html).toContain("<h2>Second</h2>");
});
