use crate::types::{Node, NodeType};
use std::fmt::Write;

use pulldown_cmark::html;
use crate::config::RenderFlags;
use crate::lib_wrapper::parser::create_parser;
use crate::components::plugins::PluginManager;

pub fn render_to_html_string(input: &str, flags: RenderFlags) -> String {
    // Pre-allocate with a reasonable size based on input length
    let estimated_size = input.len() + input.len() / 2;
    let mut html_output = String::with_capacity(estimated_size);
    
    // Fast path: No plugins needed
    if !flags.toc && !flags.directives && !flags.syntax_highlight {
        let parser = create_parser(input, flags.gfm);
        html::push_html(&mut html_output, parser);
        return html_output;
    }
    
    // Slower path: Apply plugins
    let mut manager = PluginManager::default();
    if flags.syntax_highlight {
        manager = manager.with_syntax_highlighting();
    }
    
    let parser = create_parser(input);
    let mut events: Vec<_> = parser.collect();
    manager.apply_plugins(input, &mut events);
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
            write!(out, "<h{}>", level).unwrap();
            for child in &node.children {
                render_ast_to_html_into(child, out);
            }
            write!(out, "</h{}>", level).unwrap();
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
                    write!(out, "<pre><code class=\"language-{}\">", lang).unwrap();
                } else {
                    out.push_str("<pre><code>");
                }
                out.push_str(content);
                out.push_str("</code></pre>");
            }
        }
        NodeType::Text => {
            if let Some(content) = node.content.as_deref() {
                // Simple HTML escaping
                for c in content.chars() {
                    match c {
                        '&' => out.push_str("&amp;"),
                        '<' => out.push_str("&lt;"),
                        '>' => out.push_str("&gt;"),
                        '"' => out.push_str("&quot;"),
                        _ => out.push(c),
                    }
                }
            }
        }
    }
}
