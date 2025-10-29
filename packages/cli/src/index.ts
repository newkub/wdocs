#!/usr/bin/env node
import { newProject } from './cli/new';
import { editMarkdown } from './cli/ai';
import * as clack from '@clack/prompts';

async function main() {
  const command = await clack.select({
    message: 'Select command',
    options: [
      { value: 'new', label: 'Create new project' },
      { value: 'ai', label: 'AI Markdown Editor' },
    ],
  });

  if (clack.isCancel(command)) {
    clack.cancel('Operation cancelled');
    process.exit(0);
  }

  switch (command) {
    case 'new':
      return await newProject();
    case 'ai':
      return await editMarkdown();
    default:
      clack.cancel('Invalid command');
      process.exit(1);
  }
}

main().catch(console.error);
