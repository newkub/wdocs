use napi_derive::napi;

pub mod app;
pub mod components;
pub mod config;
pub mod constants;
pub mod error;
pub mod adapters;
pub mod services;
pub mod types;
pub mod utils;

/// Renders Markdown with GFM features enabled by default.
#[napi]
pub fn render_gfm(input: String) -> String {
    let options = RenderOptions {
        gfm: Some(true),
        sanitize: Some(true),
        syntax_highlight: Some(true),
        toc: Some(true),
        directives: Some(true),
    };
    markdown_orchestrator::render_with_options(input, Some(options))
}

#[napi]
pub fn render(input: String) -> String {
    // This is a placeholder implementation.
    // The actual rendering logic should be implemented in the `app` module.
    format!("<h1>{}</h1>", input)
}
