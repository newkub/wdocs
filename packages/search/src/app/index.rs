use crate::components::inverted_index::{InvertedIndex, InvertedIndexBuilder};
use crate::components::tokenizer::Tokenizer;
use crate::types::document::{DocId, Document};
use rayon::prelude::*;
use roaring::RoaringBitmap;
use dashmap::DashMap;
use rustc_hash::FxHashMap;

pub struct Index {
    docs: FxHashMap<DocId, Document>,
    inverted_index: InvertedIndex,
    tokenizer: Tokenizer,
    staged_docs: Vec<Document>,
    next_doc_id: DocId,
    is_built: bool,
}

impl Default for Index {
    fn default() -> Self {
        Self::new()
    }
}

impl Index {
    pub fn new() -> Self {
        Self {
            docs: FxHashMap::default(),
            inverted_index: InvertedIndex::new(),
            tokenizer: Tokenizer::new(),
            staged_docs: Vec::new(),
            next_doc_id: 0,
            is_built: false,
        }
    }

    pub fn add_documents(&mut self, docs: Vec<Document>) {
        if self.is_built {
            panic!("Index is already built. Cannot add more documents.");
        }
        self.staged_docs.extend(docs);
    }

    pub fn build(&mut self) {
        if self.is_built || self.staged_docs.is_empty() {
            return;
        }

        let docs_with_ids: Vec<Document> = self
            .staged_docs
            .drain(..)
            .map(|mut doc| {
                let doc_id = self.next_doc_id;
                doc.id = doc_id;
                self.docs.insert(doc_id, doc.clone());
                self.next_doc_id += 1;
                doc
            })
            .collect();

        let final_postings_map: DashMap<String, RoaringBitmap> = DashMap::new();

        docs_with_ids.par_iter().for_each(|doc| {
            for value in doc.fields.values() {
                let tokens = self.tokenizer.tokenize(value);
                for token in tokens {
                    final_postings_map
                        .entry(token.into_owned())
                        .or_default()
                        .insert(doc.id as u32);
                }
            }
        });

        let final_postings_map = final_postings_map
            .into_iter()
            .collect::<FxHashMap<String, RoaringBitmap>>();

        let mut builder = InvertedIndexBuilder::new();
        builder.postings_map = final_postings_map;

        self.inverted_index = InvertedIndex::from_builder(builder);
        self.is_built = true;
    }

    pub fn search_ids(&self, query: &str) -> RoaringBitmap {
        let query_tokens: Vec<_> = self.tokenizer.tokenize(query).collect();
        if query_tokens.is_empty() {
            return RoaringBitmap::new();
        }

        // 1. Collect all bitmaps for the query tokens.
        let mut bitmaps: Vec<&RoaringBitmap> = query_tokens
            .iter()
            .filter_map(|token| {
                self.inverted_index
                    .term_dictionary
                    .get(token.as_ref())
                    .map(|term_index| &self.inverted_index.postings_lists[term_index as usize])
            })
            .collect();

        // If any token is not found, the intersection will be empty.
        if bitmaps.len() != query_tokens.len() {
            return RoaringBitmap::new();
        }

        // 2. Sort bitmaps by size (cardinality) to intersect smallest first.
        bitmaps.sort_unstable_by_key(|b| b.len());

        // 3. Intersect all bitmaps.
        // 3. Intersect all bitmaps.
        if let Some((first, rest)) = bitmaps.split_first() {
            rest.iter().fold((*first).clone(), |acc, &bm| acc & bm)
        } else {
            RoaringBitmap::new()
        }
    }

    pub fn search(&self, query: &str) -> Vec<Document> {
        self.search_ids(query)
            .iter()
            .take(10)
            .filter_map(|id| self.docs.get(&(id as u64)).cloned())
            .collect()
    }
}
