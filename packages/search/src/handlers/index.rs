use crate::{AppState, error::AppResult};
use axum::{
    extract::{Path, State},
    http::StatusCode,
};

pub async fn delete_index_handler(
    State(state): State<AppState>,
    Path(index_name): Path<String>,
) -> AppResult<StatusCode> {
    state.index_service.delete_index(&index_name).await?;
    Ok(StatusCode::NO_CONTENT)
}
