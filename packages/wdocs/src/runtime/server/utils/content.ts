import { promises as fs } from 'node:fs'
import matter from 'gray-matter'
import path from 'node:path'
import { simpleGit, type SimpleGit } from 'simple-git'
import type { NavItem } from '../../shared/types'
import type { SearchResult } from '../../shared/types'

const _git: SimpleGit = simpleGit()

export async function readDoc(docPath: string) {
  const filePath = path.join(process.cwd(), 'content', `${docPath}.md`);
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const { data: frontmatter, content: markdownContent } = matter(fileContent);
  return { frontmatter, markdownContent };
}

export async function getAllMarkdownFiles(dir: string): Promise<SearchResult[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name)
      if (dirent.isDirectory()) {
        return getAllMarkdownFiles(res)
      }
      if (dirent.name.endsWith('.md')) {
        const fileContent = await fs.readFile(res, 'utf-8')
        const { data, content } = matter(fileContent)
        const relativePath = path.relative(path.join(process.cwd(), 'content'), res).replace(/\\/g, '/')
        return {
          path: `/${relativePath.replace(/\.md$/, '')}`,
          title: data.title || dirent.name.replace(/\.md$/, ''),
          content: content.slice(0, 200), // excerpt
        }
      }
      return null
    })
  )

  return files.flat().filter(Boolean) as SearchResult[]
}

export async function readDirRecursive(dir: string): Promise<NavItem[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const items: NavItem[] = [];

  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      const configPath = path.join(res, 'config.json');
      let config = { title: dirent.name, order: Number.POSITIVE_INFINITY };
      try {
        const configFile = await fs.readFile(configPath, 'utf-8');
        config = { ...config, ...JSON.parse(configFile) };
            } catch (e: unknown) {
        if (e instanceof Error) {
          console.log(`Config file not found for directory, using defaults. Error: ${e.message}`);
        } else {
          console.log('An unknown error occurred while reading config file.');
        }
              }

      items.push({
        text: config.title,
        link: '#',
        order: config.order,
        children: await readDirRecursive(res),
      });
    } else if (dirent.name.endsWith('.md')) {
        const relativePath = path.relative(path.join(process.cwd(), 'content'), res).replace(/\\/g, '/');
        const fileContent = await fs.readFile(res, 'utf-8');
        const { data } = matter(fileContent);
        items.push({
          text: data.title || dirent.name.replace(/\.md$/, ''),
          link: `/${relativePath.replace(/\.md$/, '')}`,
        });
    }
  }

  return items.sort((a, b) => (a.order ?? Number.POSITIVE_INFINITY) - (b.order ?? Number.POSITIVE_INFINITY));
}
