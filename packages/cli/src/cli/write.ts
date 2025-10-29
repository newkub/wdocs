import * as clack from '@clack/prompts';

export function writeAIMode(content: string): string {
  // ส่งคืนผลลัพธ์แบบง่าย
  return `AI Processed: ${content}`
}

export async function write(content?: string, mode: 'normal' | 'ai' = 'normal'): Promise<string> {
  if (mode === 'ai') {
    if (!content) {
      throw new Error('Content is required for AI mode');
    }
    return writeAIMode(content)
  }
  
  if (!content) {
    const input = await clack.text({
      message: 'What do you want to write?',
      placeholder: 'Enter your content here',
    });
    
    if (clack.isCancel(input)) {
      clack.cancel('Operation cancelled');
      return '';
    }
    
    content = input;
  }
  
  // โหมดปกติ
  return `Normal Write: ${content}`
}