use crate::config::RenderFlags;
use pulldown_cmark::{Options, Parser};

fn get_parser_options(flags: RenderFlags) -> Options {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_HEADING_ATTRIBUTES);

    if flags.gfm {
        options.insert(Options::ENABLE_TABLES);
        options.insert(Options::ENABLE_STRIKETHROUGH);
                options.insert(Options::ENABLE_TASKLISTS);
    }

    if flags.footnotes {
        options.insert(Options::ENABLE_FOOTNOTES);
    }

    options
}

pub fn create_parser<'a>(input: &'a str, flags: RenderFlags) -> Parser<'a> {
    Parser::new_ext(input, get_parser_options(flags))
}
