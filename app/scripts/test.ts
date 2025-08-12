#!/usr/bin/env tsx

import { runAutomationTests } from '../src/tests/automation';

console.log('🤖 Molecule 自动化测试工具');
console.log('='.repeat(40));

// 检查应用是否运行
async function checkAppRunning(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:5174');
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🔍 检查应用状态...');
  
  const isRunning = await checkAppRunning();
  if (!isRunning) {
    console.log('❌ 应用未运行，请先启动开发服务器:');
    console.log('   pnpm dev');
    console.log('');
    console.log('然后重新运行测试:');
    console.log('   pnpm test:automation');
    process.exit(1);
  }
  
  console.log('✅ 应用正在运行，开始自动化测试...\n');
  
  // 运行测试
  await runAutomationTests();
}

main().catch(console.error);
