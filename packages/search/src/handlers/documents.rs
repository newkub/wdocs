use crate::{AppState, error::AppResult, types::document::Document};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};

pub async fn get_document_handler(
    State(state): State<AppState>,
    Path((index_name, document_id)): Path<(String, String)>,
) -> AppResult<Json<Document>> {
    let doc = state
        .index_service
        .get_document(&index_name, &document_id)
        .await?;
    Ok(Json(doc))
}

pub async fn delete_document_handler(
    State(state): State<AppState>,
    Path((index_name, document_id)): Path<(String, String)>,
) -> AppResult<StatusCode> {
    state
        .index_service
        .delete_document(&index_name, &document_id)
        .await?;
    Ok(StatusCode::NO_CONTENT)
}
