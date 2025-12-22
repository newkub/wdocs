use axum::{
    Router,
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
    routing::{get, post},
};
mod handlers;

use search::{
    AppState, components,
    config::AppConfig,
    error::AppResult,
    handlers::{documents as doc_handlers, index as index_handlers},
    services::index_service::{IndexService, TantivyIndexService},
    types::document::{Document, SearchResults},
};
use serde::Deserialize;
use std::sync::Arc;
use tracing_subscriber::{EnvFilter, fmt, layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    setup_tracing();

    let config = AppConfig::load()?;

    let app_state = AppState {
        index_service: Arc::new(TantivyIndexService::new(
            config.data_path,
            config.writer_memory_budget.unwrap_or(100_000_000), // Default 100MB
        )),
    };

    let app = Router::new()
        .route("/:index_name/search", get(search_handler))
        .route("/:index_name/documents", post(add_documents_handler))
        .route(
            "/:index_name/documents/:document_id",
            get(doc_handlers::get_document_handler).delete(doc_handlers::delete_document_handler),
        )
        .route("/:index_name", delete(index_handlers::delete_index_handler))
        .with_state(app_state);

    let server_addr = format!("{}:{}", config.server.host, config.server.port);
    let listener = tokio::net::TcpListener::bind(&server_addr).await?;
    tracing::info!("listening on {}", listener.local_addr()?);

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    Ok(())
}

#[derive(Deserialize)]
pub struct SearchQuery {
    q: Option<String>,
}

async fn search_handler(
    State(state): State<AppState>,
    Path(index_name): Path<String>,
    Query(query): Query<SearchQuery>,
) -> AppResult<Json<SearchResults>> {
    let index = state.index_service.get_index(&index_name).await?;
    let query_str = query.q.as_deref().unwrap_or("");
    let results = components::index::search(&index, query_str)?;
    Ok(Json(results))
}

async fn add_documents_handler(
    State(state): State<AppState>,
    Path(index_name): Path<String>,
    Json(docs): Json<Vec<Document>>,
) -> AppResult<StatusCode> {
    state.index_service.add_documents(&index_name, docs).await?;
    Ok(StatusCode::ACCEPTED)
}

fn setup_tracing() {
    let env_filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));

    let formatting_layer = fmt::layer()
        .json()
        .with_current_span(true)
        .with_span_list(true);

    tracing_subscriber::registry()
        .with(env_filter)
        .with(formatting_layer)
        .init();
}

async fn shutdown_signal() {
    tokio::signal::ctrl_c()
        .await
        .expect("failed to install Ctrl+C handler");
    tracing::warn!("Signal received, starting graceful shutdown");
}
