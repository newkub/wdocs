import { defineCachedEventHandler } from 'nitropack/runtime'
import { glob } from 'glob'
import { resolve } from 'node:path'
import matter from 'gray-matter'
import { readFile } from 'node:fs/promises'

import { z } from 'zod'
import { NavItemSchema, type Frontmatter, type NavItem } from '../../shared/types'

async function getFrontmatter(filePath: string): Promise<Frontmatter> {
  const fileContent = await readFile(filePath, 'utf-8')
  const { data } = matter(fileContent)
  return data as Frontmatter
}

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}


export default defineCachedEventHandler(async () => {
  try {
      const contentDir = resolve(process.cwd(), 'content')
    const files = await glob('**/*.md', { cwd: contentDir })

  const fileData = await Promise.all(
    files.map(async (file) => {
      const filePath = resolve(contentDir, file)
      const frontmatter = await getFrontmatter(filePath)
      return { file, frontmatter }
    }),
  )

  const navigation: NavItem[] = []
  const navMap: Record<string, NavItem> = {}

  for (const { file, frontmatter } of fileData) {
    const pathParts = file.replace(/\.md$/, '').split('/')
    let parent: NavItem | undefined
    let currentPath = ''

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i]
      if (!part) continue

      currentPath = i === 0 ? part : `${currentPath}/${part}`

      if (!navMap[currentPath]) {
        const isLastPart = i === pathParts.length - 1
        const navItem: NavItem = {
          text: (isLastPart && frontmatter.title) ? frontmatter.title : toTitleCase(part.replace(/-/g, ' ')),
          link: `/${currentPath.replace(/\/index$/, '')}`,
        }

        if (isLastPart && frontmatter.api) {
          navItem.method = frontmatter.method
        }

        if (!isLastPart) {
          navItem.children = []
        }

        navMap[currentPath] = navItem

        if (parent?.children) {
          parent.children.push(navItem)
        } else {
          navigation.push(navItem)
        }
      }
      parent = navMap[currentPath]
    }
  }

      return z.array(NavItemSchema).parse(navigation)
  } catch (error) {
    console.error('Error fetching navigation:', error)
    throw createError({
      statusCode: 500,
          statusMessage: 'Failed to generate navigation',
    cause: error,
    })
  }
})
