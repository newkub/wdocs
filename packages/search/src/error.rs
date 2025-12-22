use tantivy::query::QueryParserError;
use thiserror::Error;

/// The main error type for the application.
#[derive(Error, Debug)]
pub enum AppError {
    /// Error related to configuration.
    #[error("Configuration Error: {0}")]
    Config(String),

    /// Error related to the underlying search engine.
    #[error("Search Engine Error: {0}")]
    Search(#[from] tantivy::TantivyError),

    /// Error related to I/O operations.
    #[error("I/O Error")]
    Io(#[from] std::io::Error),

    /// Error for when a requested resource is not found.
    #[error("Not Found: {0}")]
    NotFound(String),

    /// Error for invalid arguments or requests.
    #[error("Invalid Argument: {0}")]
    InvalidArgument(String),

    #[error("Query Parse Error: {0}")]
    QueryParser(#[from] QueryParserError),

    /// For internal errors that should be a 500.
    #[error("Internal Server Error: {0}")]
    Internal(String),
}

/// A convenience type alias for `Result<T, AppError>`.
pub type AppResult<T> = Result<T, AppError>;

use axum::{
    http::StatusCode,
    response::{IntoResponse, Json},
};

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let (status, error_message) = match self {
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg.to_string()),
            AppError::InvalidArgument(msg) => (StatusCode::BAD_REQUEST, msg.to_string()),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()),
        };

        let body = Json(serde_json::json!({ "error": error_message }));
        (status, body).into_response()
    }
}
