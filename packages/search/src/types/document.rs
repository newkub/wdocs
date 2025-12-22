use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Represents a document to be indexed.
/// A document is a collection of fields, where each field has a name and a value.
/// The value can be any valid JSON value.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Default)]
pub struct Document(pub HashMap<String, serde_json::Value>);

/// Represents the settings for an index.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct IndexSettings {
    // Add settings here, e.g., stopwords, synonyms, ranking rules
    pub stop_words: Option<Vec<String>>,
    pub synonyms: Option<HashMap<String, Vec<String>>>,
}

/// Represents the results of a search query.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SearchResults {
    pub hits: Vec<Document>,
    pub nb_hits: u64,
    pub query: String,
    pub processing_time_ms: u128,
}

impl From<tantivy::schema::NamedFieldDocument> for Document {
    fn from(named_doc: tantivy::schema::NamedFieldDocument) -> Self {
        let mut doc_map = HashMap::new();
        for (field_name, values) in named_doc.0 {
            if let Some(first_value) = values.into_iter().next() {
                // For simplicity, we only take the first value.
                // A more complex implementation might handle multiple values per field.
                let json_value = match first_value {
                    tantivy::schema::OwnedValue::Str(s) => serde_json::Value::String(s),
                    tantivy::schema::OwnedValue::U64(i) => serde_json::Value::from(i),
                    tantivy::schema::OwnedValue::I64(i) => serde_json::Value::from(i),
                    tantivy::schema::OwnedValue::F64(f) => serde_json::Value::from(f),
                    tantivy::schema::OwnedValue::Date(d) => {
                        serde_json::to_value(d).unwrap_or(serde_json::Value::Null)
                    }
                    tantivy::schema::OwnedValue::Bytes(b) => {
                        serde_json::Value::String(hex::encode(b))
                    }
                    // We are ignoring other types like facets for now
                    _ => continue,
                };
                doc_map.insert(field_name, json_value);
            }
        }
        Document(doc_map)
    }
}
