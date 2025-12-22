use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone, Default)]
pub enum NodeType {
    Heading(u32),
    Paragraph,
    Strong,
    Emph,
    #[default]
    Text,
    CodeBlock(String),
    Document,
}

#[derive(Serialize, Deserialize, Debug, Default, PartialEq, Clone)]
pub struct Node {
    pub r#type: NodeType,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub children: Vec<Node>,
}
