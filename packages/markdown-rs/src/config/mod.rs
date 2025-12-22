use napi_derive::napi;

#[napi(object)]
pub struct RenderOptions {
    pub sanitize: Option<bool>,
    #[napi(js_name = "syntaxHighlight")]
    pub syntax_highlight: Option<bool>,
    pub toc: Option<bool>,
    pub directives: Option<bool>,
    pub gfm: Option<bool>,
}

#[derive(Debug, Clone, Copy)]
pub struct RenderFlags {
    pub sanitize: bool,
    pub syntax_highlight: bool,
    pub toc: bool,
    pub directives: bool,
    pub gfm: bool,
}

impl Default for RenderFlags {
    fn default() -> Self {
        Self {
            sanitize: true,
            syntax_highlight: true,
            toc: true,
            directives: true,
            gfm: true,
        }
    }
}

impl RenderFlags {
    pub fn fast() -> Self {
        Self {
            sanitize: false,
            syntax_highlight: false,
            toc: false,
            directives: false,
            gfm: false,
        }
    }

    pub fn from_options(options: Option<RenderOptions>) -> Self {
        let default_flags = Self::default();
        if let Some(o) = options {
            Self {
                sanitize: o.sanitize.unwrap_or(default_flags.sanitize),
                syntax_highlight: o.syntax_highlight.unwrap_or(default_flags.syntax_highlight),
                toc: o.toc.unwrap_or(default_flags.toc),
                directives: o.directives.unwrap_or(default_flags.directives),
                gfm: o.gfm.unwrap_or(default_flags.gfm),
            }
        } else {
            default_flags
        }
    }
}
