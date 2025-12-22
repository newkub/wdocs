use pulldown_cmark::{CowStr, Event, HeadingLevel, Tag, TagEnd};
use crate::components::plugins::Plugin;

#[derive(Debug)]
struct Heading {
    level: HeadingLevel,
    text: String,
    id: String,
}

pub struct TocPlugin;

impl Plugin for TocPlugin {
    fn process<'a>(&self, input: &str, events: &mut Vec<Event<'a>>) -> bool {
        if !input.contains("[toc]") {
            return false;
        }

        let mut headings = Vec::new();
        let mut toc_placeholder_index: Option<usize> = None;

        // Single pass to find headings and the [toc] placeholder
        let mut i = 0;
        while i < events.len() {
            match &events[i] {
                Event::Start(Tag::Heading {
                    level,
                    id: Some(id_str),
                    ..
                }) => {
                    let mut heading_text = String::new();
                    let mut j = i + 1;
                    while j < events.len() {
                        if let Event::Text(text) = &events[j] {
                            heading_text.push_str(text);
                        } else if let Event::End(TagEnd::Heading(..)) = &events[j] {
                            break;
                        }
                        j += 1;
                    }
                    headings.push(Heading {
                        level: *level,
                        text: heading_text,
                        id: id_str.to_string(),
                    });
                }
                // Check for [toc] placeholder
                _ if toc_placeholder_index.is_none() && i + 2 < events.len() => {
                    if let (
                        Event::Start(Tag::Paragraph),
                        Event::Text(text),
                        Event::End(TagEnd::Paragraph),
                    ) = (&events[i], &events[i + 1], &events[i + 2])
                    {
                        if text.trim() == "[toc]" {
                            toc_placeholder_index = Some(i);
                        }
                    }
                }
                _ => {}
            }
            i += 1;
        }

        // If [toc] was found, replace it with the generated HTML
        if let Some(index) = toc_placeholder_index {
            let toc_html = Self::generate_toc_html(&headings);
            let toc_event = Event::Html(CowStr::from(toc_html));
            events.splice(index..=index + 2, std::iter::once(toc_event));
            return true;
        }

        false
    }
}

impl TocPlugin {
    fn generate_toc_html(headings: &[Heading]) -> String {
        let mut html = String::from("<ul>");
        for heading in headings {
            let indent = match heading.level {
                HeadingLevel::H1 => "",
                HeadingLevel::H2 => "  ",
                HeadingLevel::H3 => "    ",
                _ => continue, // Ignore other levels
            };
            html.push_str(&format!(
                "<li>{}<a href=\"#{}\">{}</a></li>\n",
                indent,
                heading.id,
                heading.text
            ));
        }
        html.push_str("</ul>");
        html
    }
}
