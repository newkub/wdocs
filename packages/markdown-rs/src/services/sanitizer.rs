use crate::error::AppResult;
use lazy_static::lazy_static;
use ammonia::Builder;

lazy_static! {
    static ref AMMONIA_BUILDER: Builder<'static> = {
        let mut builder = Builder::new();
        builder.link_rel(Some("noopener noreferrer"));
        builder
    };
}

pub trait SanitizerService {
    fn clean(&self, html: &str) -> AppResult<String>;
}

pub struct AmmoniaSanitizer;

impl SanitizerService for AmmoniaSanitizer {
    fn clean(&self, html: &str) -> AppResult<String> {
        Ok(AMMONIA_BUILDER.clean(html).to_string())
    }
}
