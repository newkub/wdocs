use pulldown_cmark::{CowStr, Event, HeadingLevel, Tag, TagEnd};
use crate::components::plugins::Plugin;
use crate::config::RenderFlags;

#[derive(Debug)]
struct Heading {
    level: HeadingLevel,
    text: String,
    id: String,
}

pub struct TocPlugin;

impl Plugin for TocPlugin {
    fn process<'a>(&self, flags: RenderFlags, events: &mut Vec<Event<'a>>) -> bool {
        if !flags.toc {
            return false;
        }
        let mut headings = Vec::new();
        let mut toc_placeholder_indices = Vec::new();

        // First pass: Collect heading information and find [toc] placeholders
        for i in 0..events.len() {
            match &events[i] {
                Event::Start(Tag::Heading { .. }) => {
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
                    headings.push((i, heading_text)); // Store index and text
                }
                Event::Text(text) if text.contains("[toc]") => {
                    toc_placeholder_indices.push(i);
                }
                _ => {},
            }
        }

        if toc_placeholder_indices.is_empty() {
            return false;
        }

        // Second pass: Mutate headings and generate TOC data
        let mut toc_headings = Vec::new();
        for (index, text) in headings {
            if let Event::Start(Tag::Heading { level, id, .. }) = &mut events[index] {
                let trimmed_text = text.trim();
                let slug = trimmed_text.to_lowercase().replace(' ', "-");
                let final_id = id.as_ref().map_or_else(|| slug, |s| s.to_string());

                toc_headings.push(Heading {
                    level: *level,
                    text: trimmed_text.to_string(),
                    id: final_id.clone(),
                });

                if id.is_none() {
                    *id = Some(CowStr::from(final_id));
                }
            }
        }

        // Third pass: Replace placeholders
        let toc_html = Self::generate_toc_html(&toc_headings);
        for index in toc_placeholder_indices.iter().rev() {
            let start = if *index > 0 && matches!(events[*index - 1], Event::Start(Tag::Paragraph)) {
                *index - 1
            } else {
                *index
            };
            let end = if *index + 1 < events.len() && matches!(events[*index + 1], Event::End(TagEnd::Paragraph)) {
                *index + 1
            } else {
                *index
            };
            events.splice(start..=end, [Event::Html(CowStr::from(toc_html.clone()))]);
        }

        true
    }
}

impl TocPlugin {
    fn generate_toc_html(headings: &[Heading]) -> String {
        let mut html = String::from("<ul class=\"toc\">");
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
