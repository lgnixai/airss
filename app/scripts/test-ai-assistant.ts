#!/usr/bin/env tsx

import { runAiAssistantTests } from '../src/tests/ai-assistant-test';

async function main() {
  console.log('🤖 AI助手组件专项测试');
  console.log('='.repeat(40));
  
  // 检查应用是否运行
  try {
    const response = await fetch('http://localhost:5174');
    if (!response.ok) {
      throw new Error('应用未响应');
    }
  } catch (error) {
    console.log('❌ 应用未运行，请先启动开发服务器:');
    console.log('   npm run dev');
    console.log('');
    console.log('然后重新运行测试:');
    console.log('   npm run test:ai-assistant');
    process.exit(1);
  }
  
  console.log('✅ 应用正在运行，开始AI助手组件测试...\n');
  
  // 运行AI助手测试
  await runAiAssistantTests();
}

main().catch(console.error);
