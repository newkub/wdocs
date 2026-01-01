#!/usr/bin/env bun

import { execa } from 'execa'

const [command, ...restArgs] = process.argv.slice(2)

const usage = () => {
  console.log('Usage: wdocs <dev|build|generate|preview> [args...]')
}

if (!command) {
  usage()
  process.exit(1)
}

const mapCommandToNuxtSubcommand = (cmd: string) => {
  switch (cmd) {
    case 'dev':
      return 'dev'
    case 'build':
      return 'build'
    case 'generate':
      return 'generate'
    case 'preview':
      return 'preview'
    case 'typecheck':
      return 'typecheck'
    default:
      return null
  }
}

const nuxtSubcommand = mapCommandToNuxtSubcommand(command)

if (!nuxtSubcommand) {
  usage()
  process.exit(1)
}

await execa('bunx', ['nuxt', nuxtSubcommand, ...restArgs], {
  stdio: 'inherit',
})
