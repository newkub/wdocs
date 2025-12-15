import { defineEventHandler, createError } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'

interface NavItem {
  name: string;
  path?: string;
  order?: number;
  children?: NavItem[];
}

async function readDirRecursive(dir: string): Promise<NavItem[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const items: NavItem[] = [];

  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      const configPath = path.join(res, 'config.json');
      let config = { title: dirent.name, order: Infinity };
      try {
        const configFile = await fs.readFile(configPath, 'utf-8');
        config = { ...config, ...JSON.parse(configFile) };
            } catch (e: any) {
        console.log(`Config file not found for directory, using defaults. Error: ${e.message}`);
      }

      items.push({
        name: config.title,
        order: config.order,
        children: await readDirRecursive(res),
      });
    } else if (dirent.name.endsWith('.md')) {
        const relativePath = path.relative(path.join(process.cwd(), 'content'), res).replace(/\\/g, '/');
        items.push({
          name: dirent.name.replace(/\.md$/, ''),
          path: '/' + relativePath.replace(/\.md$/, ''),
        });
    }
  }

  return items.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
}

export default defineEventHandler(async () => {
  try {
    const contentDir = path.join(process.cwd(), 'content');
    return await readDirRecursive(contentDir);
  } catch (error) {
    console.error('Error reading content directory:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to read content structure',
    });
  }
});
