export interface NavItem {
  text: string;
  link: string;
}

export interface SidebarItem {
  text: string;
  items: NavItem[];
}

export interface WDocsConfig {
  title: string;
  description: string;
  socials: {
    github?: string;
    twitter?: string;
  };
  header: {
    logo: boolean | string;
    nav: NavItem[];
  };
  sidebar: Record<string, SidebarItem[]>;
  footer: {
    message: string;
    copyright: string;
  };
  theme: {
    primary: string;
  };
  editPage: {
    repo: string;
    branch?: string;
    dir?: string;
    text?: string;
  };
}
