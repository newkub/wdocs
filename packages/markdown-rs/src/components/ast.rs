use crate::constants::{SYNTAX_SET, THEME_SET};
use crate::types::{Node, NodeType};
use pulldown_cmark::{Event, Parser, Tag, TagEnd};
use std::fmt::Write as _;
use syntect::easy::HighlightLines;
use syntect::highlighting::Color;
use syntect::util::LinesWithEndings;
use v_htmlescape::escape;

pub fn build_ast<'a>(parser: Parser<'a>, with_syntax_highlighting: bool) -> Node {
    let root = Node {
        r#type: NodeType::Document,
        ..Default::default()
    };
    let mut stack: Vec<Node> = vec![root];

    for event in parser {
        match event {
            Event::Start(tag) => {
                let node_type = match tag {
                    Tag::Paragraph => NodeType::Paragraph,
                    Tag::Heading { level, .. } => NodeType::Heading(level as u32),
                    Tag::Strong => NodeType::Strong,
                    Tag::Emphasis => NodeType::Emph,
                    Tag::CodeBlock(kind) => {
                        let lang = if let pulldown_cmark::CodeBlockKind::Fenced(lang) = kind {
                            lang.into_string()
                        } else {
                            "text".to_string()
                        };
                        NodeType::CodeBlock(lang)
                    }
                    _ => continue,
                };
                let new_node = Node {
                    r#type: node_type,
                    ..Default::default()
                };
                stack.push(new_node);
            }
            Event::End(tag) => {
                let (expected_type, is_code_block) = match tag {
                    TagEnd::Paragraph => (NodeType::Paragraph, false),
                    TagEnd::Heading { .. } => (NodeType::Heading(0), false),
                    TagEnd::Strong => (NodeType::Strong, false),
                    TagEnd::Emphasis => (NodeType::Emph, false),
                    TagEnd::CodeBlock => (NodeType::CodeBlock("".to_string()), true),
                    _ => continue,
                };

                if let Some(mut node) = stack.pop() {
                    if std::mem::discriminant(&node.r#type) == std::mem::discriminant(&expected_type) {
                        if is_code_block {
                            let content: String = node
                                .children
                                .iter()
                                .filter_map(|c| c.content.as_ref())
                                .cloned()
                                .collect();

                            node.children.clear();

                            if with_syntax_highlighting {
                                if let NodeType::CodeBlock(lang) = &node.r#type {
                                    let syntax = SYNTAX_SET
                                        .find_syntax_by_token(lang)
                                        .unwrap_or_else(|| SYNTAX_SET.find_syntax_plain_text());
                                    let theme = &THEME_SET.themes["base16-ocean.dark"];
                                    let bg = theme
                                        .settings
                                        .background
                                        .unwrap_or(Color { r: 0, g: 0, b: 0, a: 0 });
                                    let mut html = format!(
                                        "<pre style=\"background-color:#{:02x}{:02x}{:02x};\">",
                                        bg.r, bg.g, bg.b
                                    );
                                    let mut highlighter = HighlightLines::new(syntax, theme);

                                    for line in LinesWithEndings::from(&content) {
                                        if let Ok(ranges) = highlighter.highlight_line(line, &SYNTAX_SET) {
                                            for (style, text) in ranges.iter() {
                                                let fg = style.foreground;
                                                let _ = write!(
                                                    &mut html,
                                                    "<span style=\"color:#{:02x}{:02x}{:02x};\">{}</span>",
                                                    fg.r,
                                                    fg.g,
                                                    fg.b,
                                                    escape(text)
                                                );
                                            }
                                        } else {
                                            let _ = write!(&mut html, "{}", escape(line));
                                        }
                                    }
                                    html.push_str("</pre>");
                                    node.content = Some(html);
                                } else {
                                    node.content = Some(content);
                                }
                            } else {
                                node.content = Some(content);
                            }
                        }

                        if let Some(parent) = stack.last_mut() {
                            parent.children.push(node);
                        }
                    }
                }
            }
            Event::Text(text) => {
                if let Some(parent) = stack.last_mut() {
                    parent.children.push(Node {
                        r#type: NodeType::Text,
                        content: Some(text.to_string()),
                        ..Default::default()
                    });
                }
            }
            _ => (),
        }
    }
    stack.remove(0)
}
