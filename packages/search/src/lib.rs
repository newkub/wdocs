#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use crate::app::index::Index;
use crate::types::document::Document;
use rustc_hash::FxHashMap;

pub mod app;
pub mod components;
pub mod error;
pub mod types;


#[napi(object)]
#[derive(Debug, Clone)]
pub struct JsDocument {
    pub fields: FxHashMap<String, String>,
}

#[napi]
pub struct NapiIndex {
    index: Index,
}

#[napi]
impl Default for NapiIndex {
    fn default() -> Self {
        Self::new()
    }
}

#[napi]
impl NapiIndex {
    #[napi(constructor)]
    pub fn new() -> Self {
        NapiIndex {
            index: Index::new(),
        }
    }

    #[napi]
    pub fn add_documents(&mut self, docs: Vec<JsDocument>) {
        let documents = docs
            .into_iter()
            .map(|doc| Document {
                id: 0, // The Rust Index will assign the ID
                fields: doc.fields,
            })
            .collect();
        self.index.add_documents(documents);
    }

    #[napi]
    pub fn build_index(&mut self) {
        self.index.build();
    }

    #[napi]
    pub fn search_ids(&self, query: String) -> Vec<u32> {
        self.index.search_ids(&query).iter().collect()
    }

    #[napi]
    pub fn search(&self, query: String) -> Vec<JsDocument> {
        self.index
            .search(&query)
            .into_iter()
            .map(|doc| JsDocument { fields: doc.fields })
            .collect()
    }
}
