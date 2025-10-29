import { newProject } from './cli/new';
import { write } from './cli/write';
import * as clack from '@clack/prompts';

async function main() {
  const command = await clack.select({
    message: 'Select command',
    options: [
      { value: 'new', label: 'Create new project' },
      { value: 'write', label: 'Write Markdown Editor' },
    ],
  });

  if (clack.isCancel(command)) {
    clack.cancel('Operation cancelled');
    process.exit(0);
  }

  switch (command) {
    case 'new':
      return await newProject();
    case 'write':
      const input = process.argv[2];
      const result = await write(input);
      console.log(result);
      break;
    default:
      clack.cancel('Invalid command');
      process.exit(1);
  }
}

main().catch(console.error);
