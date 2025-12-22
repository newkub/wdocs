use crate::error::{AppError, AppResult};
use crate::types::document::Document;
use async_trait::async_trait;
use std::path::PathBuf;
use std::sync::Arc;
use tantivy::{
    schema::Schema,
    Document as TantivyDocumentTrait, // The trait
    Index,
    IndexWriter,
    Term,
    TantivyDocument, // The struct
};
use tokio::sync::Mutex;

#[async_trait]
pub trait IndexService {
    async fn get_index(&self, index_name: &str) -> AppResult<Index>;
    async fn add_documents(&self, index_name: &str, docs: Vec<Document>) -> AppResult<()>;
    async fn delete_index(&self, index_name: &str) -> AppResult<()>;
    async fn get_document(&self, index_name: &str, document_id: &str) -> AppResult<Document>;
    async fn delete_document(&self, index_name: &str, document_id: &str) -> AppResult<()>;
}

#[derive(Clone)]
pub struct TantivyIndexService {
    base_path: PathBuf,
    writers: Arc<Mutex<std::collections::HashMap<String, Arc<Mutex<IndexWriter>>>>,>
    writer_memory_budget: usize,
}

impl TantivyIndexService {
    pub fn new(base_path: impl Into<PathBuf>, writer_memory_budget: usize) -> Self {
        Self {
            base_path: base_path.into(),
            writers: Arc::new(Mutex::new(std::collections::HashMap::new())),
            writer_memory_budget,
        }
    }

    fn get_or_create_index(
        &self,
        index_name: &str,
        doc_template: Option<&Document>,
    ) -> AppResult<Index> {
        let index_path = self.base_path.join(index_name);
        if index_path.exists() {
            Index::open_in_dir(&index_path).map_err(AppError::from)
        } else if let Some(doc) = doc_template {
            let schema = crate::components::index::build_schema_from_document(doc);
            std::fs::create_dir_all(&index_path)?;
            Index::create_in_dir(&index_path, schema).map_err(AppError::from)
        } else {
            Err(AppError::NotFound(index_name.to_string()))
        }
    }
}

#[async_trait]
impl IndexService for TantivyIndexService {
    async fn get_index(&self, index_name: &str) -> AppResult<Index> {
        let s = self.clone();
        let index_name = index_name.to_string();
        tokio::task::spawn_blocking(move || s.get_or_create_index(&index_name, None))
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?
    }

    async fn add_documents(&self, index_name: &str, docs: Vec<Document>) -> AppResult<()> {
        if docs.is_empty() {
            return Ok(());
        }
        let s = self.clone();
        let index_name_clone = index_name.to_string();
        let doc = docs[0].clone();
        let index_result = tokio::task::spawn_blocking(move || {
            s.get_or_create_index(&index_name_clone, Some(&doc))
        })
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?;

        let index = index_result?;
        let schema = index.schema();

        let writer_mutex = {
            let mut writers = self.writers.lock().await;
            let budget = self.writer_memory_budget;
            writers
                .entry(index_name.to_string())
                .or_insert_with(|| Arc::new(Mutex::new(index.writer(budget).unwrap())))
                .clone()
        };

        let mut writer = writer_mutex.lock().await;
        for doc in docs {
            let tantivy_doc = crate::components::index::document_to_tantivy_doc(&schema, &doc)?;
            writer.add_document(tantivy_doc)?;
        }

        writer.commit()?;
        Ok(())
    }

    async fn delete_index(&self, index_name: &str) -> AppResult<()> {
        let index_path = self.base_path.join(index_name);
        if index_path.exists() {
            tokio::fs::remove_dir_all(&index_path).await?;
            self.writers.lock().await.remove(index_name);
            Ok(())
        } else {
            Err(AppError::NotFound(index_name.to_string()))
        }
    }

    async fn get_document(&self, index_name: &str, document_id: &str) -> AppResult<Document> {
        let index = self.get_index(index_name).await?;
        let reader = index.reader()?;
        let searcher = reader.searcher();
        let schema = index.schema();

        let id_field = schema
            .get_field("id")
            .ok_or_else(|| AppError::InvalidArgument("Schema does not have an 'id' field".to_string()))?;

        let term = Term::from_field_text(id_field, document_id);
        let query = tantivy::query::TermQuery::new(term, tantivy::schema::IndexRecordOption::Basic);

        let top_docs = searcher.search(&query, &tantivy::collector::TopDocs::with_limit(1))?;

        if let Some((_score, doc_address)) = top_docs.first() {
            let retrieved_doc: TantivyDocument = searcher.doc(*doc_address)?;
            Ok(retrieved_doc.to_named_doc(&schema).into())
        } else {
            Err(AppError::NotFound(format!(
                "Document with id '{}' not found in index '{}'",
                document_id,
                index_name
            )))
        }
    }

    async fn delete_document(&self, index_name: &str, document_id: &str) -> AppResult<()> {
        let index = self.get_index(index_name).await?;
        let schema = index.schema();
        let id_field = schema
            .get_field("id")
            .ok_or_else(|| AppError::InvalidArgument("Schema does not have an 'id' field".to_string()))?;

        let writer_mutex = {
            let mut writers = self.writers.lock().await;
            let budget = self.writer_memory_budget;
            writers
                .entry(index_name.to_string())
                .or_insert_with(|| Arc::new(Mutex::new(index.writer(budget).unwrap())))
                .clone()
        };

        let mut writer = writer_mutex.lock().await;
        let term = Term::from_field_text(id_field, document_id);
        writer.delete_term(term);
        writer.commit()?;
        Ok(())
    }
}
