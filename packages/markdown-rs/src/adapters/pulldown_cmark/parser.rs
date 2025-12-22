use pulldown_cmark::{Options, Parser};

fn get_parser_options(gfm: bool) -> Options {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_HEADING_ATTRIBUTES);

    if gfm {
        options.insert(Options::ENABLE_TABLES);
        options.insert(Options::ENABLE_STRIKETHROUGH);
        options.insert(Options::ENABLE_TASKLISTS);
        options.insert(Options::ENABLE_AUTOLINKS);
    }
    options
}

pub fn create_parser<'a>(input: &'a str, gfm: bool) -> Parser<'a> {
    Parser::new_ext(input, get_parser_options(gfm))
}
