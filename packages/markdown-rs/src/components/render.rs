use crate::types::{Node, NodeType};
use std::fmt::Write;

use pulldown_cmark::html;
use crate::config::RenderFlags;
use crate::adapters::pulldown_cmark::parser::create_parser;
use v_htmlescape::escape;
use crate::components::plugins::PluginManager;

pub fn render_to_html_string(input: &str, flags: RenderFlags) -> String {
    let mut html_output = String::with_capacity(input.len() * 2);
    let parser = create_parser(input, flags);

    // Fast path for when no plugins are enabled
    if !flags.syntax_highlight && !flags.toc && !flags.directives {
        html::push_html(&mut html_output, parser);
        return html_output;
    }

    // Slower path: process events as a stream
    let mut transformed_events = parser;
    // Note: The order of plugin application might matter.
    // For now, we'll assume a fixed order.
    // In the future, a more sophisticated plugin system could allow ordering.

    // This approach is not yet implemented as plugins need to be adapted
    // to work with iterators instead of a mutable Vec.
    // For now, we keep the existing implementation but acknowledge its inefficiency.
    let mut events: Vec<_> = transformed_events.collect();
    let mut manager = PluginManager::new();

    if flags.toc {
        manager.add_plugin(Box::new(crate::components::plugins::toc::TocPlugin));
    }
    if flags.directives {
        manager.add_plugin(Box::new(crate::components::plugins::directive::DirectivePlugin));
    }
    if flags.syntax_highlight {
        manager.add_plugin(Box::new(crate::components::plugins::syntax::SyntaxHighlightingPlugin));
    }

    manager.apply_plugins(flags, &mut events);
    html::push_html(&mut html_output, events.into_iter());

    html_output
}

pub fn render_ast_to_html(node: &Node) -> String {
    // Estimate size based on node content length if available
    let initial_capacity = node.content.as_ref().map_or(1024, |s| s.len() * 2);
    let mut out = String::with_capacity(initial_capacity);
    render_ast_to_html_into(node, &mut out);
    out
}

fn render_ast_to_html_into(node: &Node, out: &mut String) {
    match &node.r#type {
        NodeType::Document => {
            // Reserve space for children
            let child_len: usize = node.children.iter().map(|c| c.content.as_ref().map_or(0, |s| s.len())).sum();
            out.reserve(child_len + node.children.len() * 16); // Approximate tag overhead
            
            for child in &node.children {
                render_ast_to_html_into(child, out);
            }
        }
        NodeType::Paragraph => {
            out.push_str("<p>");
            for child in &node.children {
                render_ast_to_html_into(child, out);
            }
            out.push_str("</p>");
        }
        NodeType::Heading(level) => {
            if write!(out, "<h{}>", level).is_ok() {
                for child in &node.children {
                    render_ast_to_html_into(child, out);
                }
                let _ = write!(out, "</h{}>", level);
            }
        }
        NodeType::Strong => {
            out.push_str("<strong>");
            for child in &node.children {
                render_ast_to_html_into(child, out);
            }
            out.push_str("</strong>");
        }
        NodeType::Emph => {
            out.push_str("<em>");
            for child in &node.children {
                render_ast_to_html_into(child, out);
            }
            out.push_str("</em>");
        }
        NodeType::CodeBlock(lang) => {
            if let Some(content) = node.content.as_deref() {
                if !lang.is_empty() {
                    let _ = write!(out, "<pre><code class=\"language-{}\">", lang);
                } else {
                    out.push_str("<pre><code>");
                }
                out.push_str(content);
                out.push_str("</code></pre>");
            }
        }
        NodeType::Text => {
            if let Some(content) = node.content.as_deref() {
                                let _ = write!(out, "{}", escape(content));
            }
        }
    }
}
