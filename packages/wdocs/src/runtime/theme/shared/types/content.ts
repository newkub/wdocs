export interface ContentItem {
  name: string;
  path: string;
  children?: ContentItem[];
}

export interface PageContent {
  path: string;
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  sourcePath?: string;
  lastUpdated?: string;
  'og:title'?: string;
  'og:description'?: string;
  'og:image'?: string;
  'og:type'?: 'article' | 'website' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_status' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
  'twitter:card'?: 'summary_large_image' | 'summary' | 'app' | 'player';
  'twitter:creator'?: string;
  [key: string]: unknown;
}

export interface NavItem {
  name: string;
  path?: string;
  order?: number;
  sourcePath?: string;
  lastUpdated?: string;
  children?: NavItem[];
}
