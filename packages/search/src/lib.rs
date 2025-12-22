pub mod components;
pub mod config;
pub mod error;
pub mod handlers;
pub mod services;
use crate::services::index_service::IndexService;
use std::sync::Arc;

pub mod types;

#[derive(Clone)]
pub struct AppState {
    pub index_service: Arc<dyn IndexService + Send + Sync>,
}
