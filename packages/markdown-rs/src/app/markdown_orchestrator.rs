use crate::components::{ast::build_ast, render::render_to_html_string, toc::generate_toc_html};
use crate::config::RenderFlags;
use crate::adapters::pulldown_cmark::parser::create_parser;
use crate::services::sanitizer;


pub fn render(input: String) -> String {
    let flags = RenderFlags::default();
    let unsafe_html = render_to_html_string(&input, flags);
    sanitizer::sanitize(unsafe_html, flags.sanitize)
}


pub fn render_with_options(input: String, flags: RenderFlags) -> String {
    let processed_input = if flags.toc {
        let toc_html = generate_toc_html(&input);
        input.replacen("[toc]", &toc_html, 1)
    } else {
        input
    };

    let unsafe_html = render_to_html_string(&processed_input, flags);
    sanitizer::sanitize(unsafe_html, flags.sanitize)
}

pub fn parse(input: String) -> String {
        let flags = RenderFlags {
        gfm: true,
        footnotes: true,
        ..Default::default()
    };
    let parser = create_parser(&input, flags);
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
