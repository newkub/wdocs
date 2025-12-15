#!/usr/bin/env node
import { execa } from 'execa'

const command = process.argv[2]
const args = process.argv.slice(3)

const commandMap: Record<string, string> = {
  dev: 'nuxi dev',
  build: 'nuxi build',
  generate: 'nuxi generate',
  preview: 'nuxi preview'
}

if (command && command in commandMap) {
  const [cmd, ...cmdArgs] = commandMap[command].split(' ')
  execa(cmd, [...cmdArgs, ...args], { stdio: 'inherit' })
} else {
  console.error(`Unknown or missing command: ${command ?? 'none'}`)
  process.exit(1)
}
