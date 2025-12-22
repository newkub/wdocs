import { defineEventHandler, createError } from 'h3'
import path from 'node:path'
import { readDirRecursive } from '../utils/content'

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
