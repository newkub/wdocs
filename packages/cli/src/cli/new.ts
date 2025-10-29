import * as clack from '@clack/prompts';

export async function newProject() {
  clack.intro('🚀 Create new project');

  const project = await clack.text({
    message: 'Project name?',
    placeholder: 'my-project',
    validate: (value) => {
      if (!value) return 'Project name is required!';
      if (!/^[a-z0-9-]+$/.test(value)) return 'Use only lowercase, numbers and hyphens';
    }
  });
  
  if (clack.isCancel(project)) {
    clack.cancel('Operation cancelled');
    return;
  }

  const projectType = await clack.select({
    message: 'Select project type',
    options: [
      { value: 'web', label: 'Web Application' },
      { value: 'api', label: 'API Server' },
      { value: 'lib', label: 'Library' },
    ],
  });

  if (clack.isCancel(projectType)) {
    clack.cancel('Operation cancelled');
    return;
  }

  const confirm = await clack.confirm({
    message: `Create ${project} as ${projectType} project?`,
  });

  if (!confirm || clack.isCancel(confirm)) {
    clack.cancel('Operation cancelled');
    return;
  }

  const spinner = clack.spinner();
  spinner.start('Creating project...');
  // Simulate project creation
  await new Promise(resolve => setTimeout(resolve, 2000));
  spinner.stop('Project created!');

  clack.outro(`🎉 Project ready! Next steps:\n  cd ${String(project)}\n  bun install\n  bun run dev`);

  return { project, projectType };
}
