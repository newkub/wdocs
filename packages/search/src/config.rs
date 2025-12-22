use crate::error::{AppError, AppResult};
use figment::{
    Figment,
    providers::{Env, Format, Toml},
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub server: ServerConfig,
    pub data_path: String,
    pub writer_memory_budget: Option<usize>,
}

impl AppConfig {
    pub fn load() -> AppResult<Self> {
        Figment::new()
            .merge(Toml::file("Config.toml"))
            .merge(Env::prefixed("APP_").split("__"))
            .extract()
            .map_err(|e| AppError::Config(e.to_string()))
    }
}
