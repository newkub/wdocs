use napi_derive::napi;

#[napi(object)]
pub struct RenderOptions {
    pub sanitize: Option<bool>,
    #[napi(js_name = "syntaxHighlight")]
    pub syntax_highlight: Option<bool>,
    pub toc: Option<bool>,
    pub directives: Option<bool>,
    pub gfm: Option<bool>,
    pub footnotes: Option<bool>,
}

#[derive(Debug, Clone, Copy)]
pub struct RenderFlags {
    pub sanitize: bool,
    pub syntax_highlight: bool,
    pub toc: bool,
    pub directives: bool,
    pub gfm: bool,
    pub footnotes: bool,
}

impl Default for RenderFlags {
    fn default() -> Self {
        Self {
            sanitize: true,
            syntax_highlight: false, // Disabled by default
            toc: false, // Disabled by default
            directives: false, // Disabled by default
            gfm: true,
            footnotes: false, // Disabled by default
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
            footnotes: false,
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
                footnotes: o.footnotes.unwrap_or(default_flags.footnotes),
            }
        } else {
            default_flags
        }
    }
}
