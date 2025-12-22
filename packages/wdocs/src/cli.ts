#!/usr/bin/env node
import { execa } from 'execa'

const command = process.argv[2]
const args = process.argv.slice(3)

const commandMap: Record<string, string> = {
  dev: 'nuxi dev',
  build: 'nuxi build',
  generate: 'nuxi generate',
  preview: 'nuxi preview',
  prepare: 'nuxi prepare'
}

if (command && command in commandMap) {
    const [cmd, ...cmdArgs] = (commandMap[command] || '').split(' ')
  if (cmd) {
    execa(cmd, [...cmdArgs, ...args], { stdio: 'inherit', preferLocal: true })
  } else {
    console.error(`Invalid command definition for: ${command}`)
    process.exit(1)
  }
} else {
  console.error(`Unknown or missing command: ${command ?? 'none'}`)
  process.exit(1)
}
