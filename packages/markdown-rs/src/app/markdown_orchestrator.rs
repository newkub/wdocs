use crate::components::{ast::build_ast, render::render_to_html_string};
use crate::config::{RenderFlags, RenderOptions};
use crate::adapters::pulldown_cmark::parser::create_parser;
use crate::services::sanitizer::{AmmoniaSanitizer, SanitizerService};

fn sanitize_if_needed(html: String, sanitize: bool) -> String {
    if !sanitize {
        return html;
    }
    let sanitizer = AmmoniaSanitizer;
    sanitizer.clean(&html).unwrap_or(html)
}

pub fn render(input: String) -> String {
    let flags = RenderFlags::default();
    let unsafe_html = render_to_html_string(&input, flags);
    sanitize_if_needed(unsafe_html, flags.sanitize)
}

pub fn render_fast(input: String) -> String {
    let flags = RenderFlags::fast();
    render_to_html_string(&input, flags)
}

pub fn render_with_options(input: String, options: Option<RenderOptions>) -> String {
    let flags = RenderFlags::from_options(options);
    let unsafe_html = render_to_html_string(&input, flags);
    sanitize_if_needed(unsafe_html, flags.sanitize)
}

pub fn parse(input: String) -> String {
    let parser = create_parser(&input, true);
    let ast = build_ast(parser, false);
    serde_json::to_string(&ast).unwrap_or_else(|_| "null".to_string())
}

// Exposed for benchmarks and tests
pub fn render_unsafe(input: &str) -> String {
    render_to_html_string(input, RenderFlags::default())
}

pub fn render_unsafe_no_highlight(input: &str) -> String {
    let flags = RenderFlags {
        syntax_highlight: false,
        ..Default::default()
    };
    render_to_html_string(input, flags)
}
