#!/usr/bin/env node

/**
 * 简化插件测试运行脚本
 */

const { runSimplePluginTest } = require('../src/tests/simple-plugin-test.ts');

async function main() {
  console.log('🔍 开始运行简化插件测试...');
  console.log('='.repeat(50));
  
  try {
    await runSimplePluginTest();
    console.log('\n✅ 测试完成');
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  }
}

// 运行测试
main().catch(console.error);
