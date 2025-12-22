use crate::config::RenderFlags;
use pulldown_cmark::Event;

pub mod directive;
pub mod syntax;
pub mod toc;

pub trait Plugin: Send + Sync {
    fn process<'a>(&self, flags: RenderFlags, events: &mut Vec<Event<'a>>) -> bool;
}

pub struct PluginManager {
    plugins: Vec<Box<dyn Plugin>>,
}

impl PluginManager {
    pub fn new() -> Self {
        Self { plugins: vec![] }
    }

    pub fn add_plugin(&mut self, plugin: Box<dyn Plugin>) {
        self.plugins.push(plugin);
    }

    pub fn apply_plugins<'a>(&self, flags: RenderFlags, events: &mut Vec<Event<'a>>) -> bool {
        let mut changed = false;
        for plugin in &self.plugins {
            if plugin.process(flags, events) {
                changed = true;
            }
        }
        changed
    }
}

impl PluginManager {
    pub fn with_syntax_highlighting(mut self) -> Self {
        self.add_plugin(Box::new(syntax::SyntaxHighlightingPlugin));
        self
    }
}

impl Default for PluginManager {
    fn default() -> Self {
        let mut manager = PluginManager::new();
        manager.add_plugin(Box::new(toc::TocPlugin));
        manager.add_plugin(Box::new(directive::DirectivePlugin));
        manager.add_plugin(Box::new(syntax::SyntaxHighlightingPlugin));
        manager.add_plugin(Box::new(syntax::SyntaxHighlightingPlugin));
        manager
    }
}
