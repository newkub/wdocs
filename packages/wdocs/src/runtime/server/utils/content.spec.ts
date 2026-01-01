import { describe, it, expect } from 'vitest'
import path from 'node:path'
import { readDirRecursive } from './content'

describe('server/utils/content', () => {
  it('should read the content directory and generate a navigation tree', async () => {
    const contentPath = path.join(process.cwd(), 'content')
    const navigation = await readDirRecursive(contentPath)

    // Basic assertions
    expect(Array.isArray(navigation)).toBe(true)
    expect(navigation.length).toBeGreaterThan(0)

    // Check for a specific known item
    const gettingStarted = navigation.find(item => item.link === '/getting-started')
    expect(gettingStarted).toBeDefined()

    // Check for a nested item
    const guide = navigation.find(item => item.text === 'Guide')
    expect(guide).toBeDefined()
    if (!guide) {
      throw new Error('"Guide" navigation item not found')
    }
    expect(guide.children).toBeInstanceOf(Array)
    expect(guide.children.length).toBeGreaterThan(0)
  })
})
