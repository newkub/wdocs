use std::borrow::Cow;

pub struct Tokenizer;

impl Default for Tokenizer {
    fn default() -> Self {
        Self::new()
    }
}

impl Tokenizer {
    pub fn new() -> Self {
        Self
    }

    /// Tokenizes a given text into a sequence of normalized terms.
    ///
    /// The process involves:
    /// 1. Splitting the text by whitespace.
    /// 2. Trimming non-alphanumeric characters from the start and end of each token.
    /// 3. Converting tokens to lowercase.
    /// 4. Filtering out any empty tokens that result from this process.
    pub fn tokenize<'a>(&self, text: &'a str) -> impl Iterator<Item = Cow<'a, str>> + 'a {
        text.split_whitespace().filter_map(Self::normalize_token)
    }

    /// Normalizes a single token by trimming, lowercasing, and checking for emptiness.
    fn normalize_token<'a>(token: &'a str) -> Option<Cow<'a, str>> {
        let trimmed = token.trim_matches(|c: char| !c.is_alphanumeric());
        if trimmed.is_empty() {
            return None;
        }

        if trimmed.chars().any(|c| c.is_uppercase()) {
            Some(Cow::Owned(trimmed.to_lowercase()))
        } else {
            Some(Cow::Borrowed(trimmed))
        }
    }
}
