use crate::error::{AppError, AppResult};
use crate::types::document::{Document, SearchResults};
use std::time::Instant;
use tantivy::{
    collector::TopDocs,
    query::QueryParser,
    schema::{Field, Schema, STORED, TEXT},
    Document as TantivyDocumentTrait, // The trait
    Index,
    TantivyDocument, // The struct
};

/// Builds the Tantivy schema from a document, treating all fields as text fields.
pub fn build_schema_from_document(doc: &Document) -> Schema {
    let mut schema_builder = Schema::builder();
    for key in doc.0.keys() {
        schema_builder.add_text_field(key, TEXT | STORED);
    }
    schema_builder.build()
}

pub fn document_to_tantivy_doc(
    schema: &Schema,
    doc: &Document,
) -> AppResult<TantivyDocument> {
    let mut tantivy_doc = TantivyDocument::new();
    for (key, value) in &doc.0 {
        if let Ok(field) = schema.get_field(key) {
            add_field_value(&mut tantivy_doc, field, value)?;
        }
    }
    Ok(tantivy_doc)
}

fn add_field_value(
    tantivy_doc: &mut TantivyDocument,
    field: Field,
    value: &serde_json::Value,
) -> AppResult<()> {
    match value {
        serde_json::Value::String(s) => tantivy_doc.add_text(field, s),
        serde_json::Value::Number(n) => {
            if n.is_i64() {
                tantivy_doc.add_i64(field, n.as_i64().unwrap());
            } else if n.is_f64() {
                tantivy_doc.add_f64(field, n.as_f64().unwrap());
            }
        }
        serde_json::Value::Bool(b) => tantivy_doc.add_bool(field, *b),
        _ => {
            // In a real app, you might want to log this instead of erroring,
            // or handle it based on the field type from the schema.
        }
    };
    Ok(())
}

pub fn search(index: &Index, query_str: &str) -> AppResult<SearchResults> {
    let start_time = Instant::now();
    let reader = index.reader()?;
    let searcher = reader.searcher();
    let schema = index.schema();
    let default_fields: Vec<_> = schema.fields().map(|(field, _)| field).collect();

    if default_fields.is_empty() {
        return Ok(SearchResults {
            hits: vec![],
            nb_hits: 0,
            query: query_str.to_string(),
            processing_time_ms: start_time.elapsed().as_millis(),
        });
    }

    let query_parser = QueryParser::for_index(index, default_fields);
    let query = query_parser.parse_query(query_str)?;

    let top_docs = searcher.search(&query, &TopDocs::with_limit(10))?;

    let mut hits = Vec::new();
    for (_score, doc_address) in top_docs {
        let retrieved_doc: TantivyDocument = searcher.doc(doc_address)?;
        let doc = retrieved_doc.to_named_doc(&schema).into();
        hits.push(doc);
    }

    Ok(SearchResults {
        hits,
        nb_hits: searcher.num_docs() as u64,
        query: query_str.to_string(),
        processing_time_ms: start_time.elapsed().as_millis(),
    })
}
