use criterion::{criterion_group, criterion_main, Criterion};
use std::hint::black_box;
use markdown_rs::{render, render_unsafe, render_unsafe_no_highlight};
use comrak::Options;

fn get_sample_markdown() -> String {
    std::fs::read_to_string("benches/sample.md").expect("Failed to read sample.md")
}

fn bench_markdown_rs_unsafe_no_highlight(c: &mut Criterion) {
    let markdown = get_sample_markdown();
    c.bench_function("markdown_rs_render_unsafe_no_highlight", |b| {
        b.iter(|| render_unsafe_no_highlight(black_box(&markdown.clone())))
    });
}

fn bench_markdown_rs_unsafe(c: &mut Criterion) {
    let markdown = get_sample_markdown();
    c.bench_function("markdown_rs_render_unsafe", |b| {
        b.iter(|| render_unsafe(black_box(&markdown.clone())))
    });
}

fn bench_markdown_rs(c: &mut Criterion) {
    let markdown = get_sample_markdown();
    c.bench_function("markdown_rs_render", |b| {
        b.iter(|| render(black_box(markdown.clone())))
    });
}

fn bench_comrak(c: &mut Criterion) {
    let markdown = get_sample_markdown();
    let options = Options::default();
    c.bench_function("comrak_render", |b| {
        b.iter(|| comrak::markdown_to_html(black_box(&markdown), &options))
    });
}

fn bench_pulldown_cmark(c: &mut Criterion) {
    let markdown = get_sample_markdown();
    c.bench_function("pulldown_cmark_render", |b| {
        b.iter(|| {
            let parser = pulldown_cmark::Parser::new_ext(black_box(&markdown), pulldown_cmark::Options::all());
            let mut html_output = String::new();
            pulldown_cmark::html::push_html(&mut html_output, parser);
            html_output
        })
    });
}

criterion_group!(benches, bench_markdown_rs, bench_markdown_rs_unsafe, bench_markdown_rs_unsafe_no_highlight, bench_comrak, bench_pulldown_cmark);
criterion_main!(benches);
