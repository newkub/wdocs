use crate::types::{Node, NodeType};
use pulldown_cmark::{Event, Tag, TagEnd};

pub fn build_ast<'a>(
    parser: &mut dyn Iterator<Item = Event<'a>>,
) -> Node {
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
                            node.content = Some(content);
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
