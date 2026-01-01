use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Generic error: {0}")]
    Generic(String),
}

pub type AppResult<T> = Result<T, AppError>;
