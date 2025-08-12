#!/usr/bin/env node

/**
 * Puppeteer 测试运行脚本
 * 用于运行插件加载自动化测试
 */

const { runPluginLoadingTest } = require('../src/tests/plugin-loading-test.ts');

async function main() {
  console.log('🤖 开始运行 Puppeteer 插件加载测试...');
  console.log('='.repeat(50));
  
  try {
    await runPluginLoadingTest();
    console.log('\n✅ 测试完成');
  } catch (error) {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  }
}

// 运行测试
main().catch(console.error);
