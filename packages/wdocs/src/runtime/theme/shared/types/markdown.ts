export interface Heading {
  level: number;
  title: string;
  slug: string;
}

export interface MarkdownApiResponse {
  html: string;
  headings: Heading[];
}
