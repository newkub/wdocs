import { AI } from './ai'

export function writeAIMode(content: string): string {
  // เรียกใช้ AI เพื่อประมวลผล content
  const aiResponse = AI.process(content)
  
  // ส่งคืนผลลัพธ์
  return `AI Processed: ${aiResponse}`
}

// ฟังก์ชันหลักสำหรับการเขียน
export function write(content: string, mode: 'normal' | 'ai' = 'normal'): string {
  if (mode === 'ai') {
    return writeAIMode(content)
  }
  
  // โหมดปกติ
  return `Normal Write: ${content}`
}