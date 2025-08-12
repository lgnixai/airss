/**
 * Hello 插件测试运行器
 * 自动运行所有Hello插件测试
 */

import { AutomatedHelloTest } from './automated-hello-test';
import { SimpleHelloTest } from './simple-hello-test';
import { QuickHelloTest } from './quick-hello-test';

export class HelloTestRunner {
  async runAllTests() {
    console.log('🚀 开始运行所有Hello插件测试...');
    console.log('='.repeat(60));
    
    // 等待页面加载
    await this.waitForPageLoad();
    
    // 运行快速测试
    console.log('\n📋 1. 运行快速测试...');
    const quickTest = new QuickHelloTest();
    await quickTest.runQuickTest();
    
    // 等待一段时间
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 运行简单测试
    console.log('\n📋 2. 运行简单测试...');
    const simpleTest = new SimpleHelloTest();
    await simpleTest.runTest();
    
    // 等待一段时间
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 运行自动化测试
    console.log('\n📋 3. 运行自动化测试...');
    const automatedTest = new AutomatedHelloTest();
    await automatedTest.runAutomatedTest();
    
    // 生成最终报告
    this.generateFinalReport();
  }

  private async waitForPageLoad() {
    console.log('⏳ 等待页面加载...');
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      if (document.readyState === 'complete') {
        console.log('✅ 页面加载完成');
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    // 额外等待插件系统初始化
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  private generateFinalReport() {
    console.log('\n🎯 Hello插件测试完成！');
    console.log('='.repeat(60));
    
    console.log('📊 测试总结:');
    console.log('- ✅ 快速测试: 检查基本功能');
    console.log('- ✅ 简单测试: 详细检查元素');
    console.log('- ✅ 自动化测试: 全面诊断问题');
    
    console.log('\n🔍 如果Hello插件仍然不工作，请检查:');
    console.log('1. 浏览器控制台是否有错误信息');
    console.log('2. 网络请求是否正常');
    console.log('3. 插件系统是否正确初始化');
    console.log('4. Molecule框架是否正确加载');
    
    console.log('\n📝 手动调试命令:');
    console.log('// 检查Molecule对象');
    console.log('console.log(window.molecule);');
    console.log('// 检查活动栏');
    console.log('console.log(window.molecule?.activityBar?.getState());');
    console.log('// 手动添加Hello图标');
    console.log('window.molecule?.activityBar?.add({id: "hello-test", name: "Hello Test", icon: "👋"});');
    
    console.log('\n🎉 测试完成！请查看上面的详细结果。');
  }
}

// 自动运行所有测试
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const runner = new HelloTestRunner();
      runner.runAllTests();
    }, 2000);
  });
}

// 手动运行所有测试
(window as any).runAllHelloTests = () => {
  const runner = new HelloTestRunner();
  runner.runAllTests();
};

// 单独运行测试的函数
(window as any).runQuickTest = () => {
  const test = new QuickHelloTest();
  test.runQuickTest();
};

(window as any).runSimpleTest = () => {
  const test = new SimpleHelloTest();
  test.runTest();
};

(window as any).runAutomatedTest = () => {
  const test = new AutomatedHelloTest();
  test.runAutomatedTest();
};
