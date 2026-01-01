declare module 'markdown-it-include';
declare module 'markdown-it-mermaid';
declare module 'markdown-it-container';
declare module 'search' {
  export class NapiIndex {
    constructor()
    addDocuments(documents: any[]): void
    buildIndex(): void
    search(query: string): any[]
  }
}
