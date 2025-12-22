use pulldown_cmark::{CowStr, Event, Tag, TagEnd, CodeBlockKind};
use std::collections::VecDeque;
use super::plugins::syntax::highlight_code_block_html;

pub struct SyntaxHighlightStream<'a, I>
where
    I: Iterator<Item = Event<'a>>,
{
    inner: I,
    buffer: VecDeque<Event<'a>>,
    in_code_block: bool,
    language: Option<CowStr<'a>>,
}

impl<'a, I> SyntaxHighlightStream<'a, I>
where
    I: Iterator<Item = Event<'a>>,
{
    pub fn new(inner: I) -> Self {
        Self {
            inner,
            buffer: VecDeque::new(),
            in_code_block: false,
            language: None,
        }
    }
}

impl<'a, I> Iterator for SyntaxHighlightStream<'a, I>
where
    I: Iterator<Item = Event<'a>>,
{
    type Item = Event<'a>;

    fn next(&mut self) -> Option<Self::Item> {
        if let Some(ev) = self.buffer.pop_front() {
            return Some(ev);
        }

        let ev = self.inner.next()?;
        match ev {
            Event::Start(Tag::CodeBlock(kind)) => {
                self.in_code_block = true;
                self.language = None;
                if let CodeBlockKind::Fenced(lang) = kind {
                    self.language = Some(lang);
                }
                Some(Event::Html(CowStr::from("<pre><code>")))
            }
            Event::End(TagEnd::CodeBlock) => {
                self.in_code_block = false;
                self.language = None;
                Some(Event::Html(CowStr::from("</code></pre>")))
            }
            Event::Text(text) if self.in_code_block => {
                let lang = self.language.as_deref().unwrap_or("text");
                if let Some(html) = highlight_code_block_html(lang, text.as_ref()) {
                    return Some(Event::Html(CowStr::from(html)));
                }
                Some(Event::Text(text))
            }
            other => Some(other),
        }
    }
}
