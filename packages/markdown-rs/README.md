# Markdown-RS

A Rust-powered Markdown parser with Node.js bindings via NAPI-rs.

## Features

- Fast Markdown parsing
- Syntax highlighting
- Extensible with plugins

## Usage

```javascript
const { parse, render } = require("./index");

const markdown = "# Hello, world!";
const ast = parse(markdown);
const html = render(markdown);

console.log(html);
```

## Development

- `bun install`
- `bun run build`
