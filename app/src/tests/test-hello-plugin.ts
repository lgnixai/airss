/**
 * Hello 插件功能测试
 * 用于验证 Hello 插件的基本功能是否正常工作
 */

export class HelloPluginTester {
  private testResults: Array<{ test: string; status: 'pass' | 'fail'; message: string }> = [];

  async runTests() {
    console.log('🧪 开始测试 Hello 插件...');
    
    // 等待页面加载
    await this.waitForPageLoad();
    
    // 运行测试用例
    await this.testPluginLoading();
    await this.testStatusBar();
    await this.testRibbonIcon();
    await this.testClickFunctionality();
    await this.testSidebarContent();
    await this.testEditorContent();
    
    // 生成测试报告
    this.generateReport();
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
    
    if (attempts >= maxAttempts) {
      console.warn('⚠️ 页面加载超时');
    }
  }

  private async testPluginLoading() {
    console.log('🔍 测试插件加载状态...');
    
    // 检查控制台日志中是否有插件加载信息
    const consoleLogs = this.getConsoleLogs();
    const hasPluginLoaded = consoleLogs.some(log => 
      log.includes('Hello Plugin loaded') || 
      log.includes('Hello Plugin initialization completed')
    );
    
    if (hasPluginLoaded) {
      this.addTestResult('插件加载', 'pass', 'Hello 插件成功加载');
    } else {
      this.addTestResult('插件加载', 'fail', '未检测到 Hello 插件加载日志');
    }
  }

  private async testStatusBar() {
    console.log('🔍 测试状态栏显示...');
    
    // 查找状态栏中的 Hello 插件文本
    const statusBarItems = document.querySelectorAll('[class*="status"], [class*="Status"]');
    let foundStatusBar = false;
    
    for (const item of Array.from(statusBarItems)) {
      if (item.textContent?.includes('👋 Hello Plugin')) {
        foundStatusBar = true;
        break;
      }
    }
    
    if (foundStatusBar) {
      this.addTestResult('状态栏显示', 'pass', '状态栏正确显示 Hello 插件信息');
    } else {
      this.addTestResult('状态栏显示', 'fail', '未找到状态栏中的 Hello 插件信息');
    }
  }

  private async testRibbonIcon() {
    console.log('🔍 测试功能区图标...');
    
    // 查找功能区图标
    const ribbonIcons = document.querySelectorAll('[class*="ribbon"], [class*="activity"], [class*="icon"]');
    let foundIcon = false;
    
    for (const icon of Array.from(ribbonIcons)) {
      if (icon.textContent?.includes('👋') || icon.innerHTML?.includes('👋')) {
        foundIcon = true;
        break;
      }
    }
    
    if (foundIcon) {
      this.addTestResult('功能区图标', 'pass', '找到 Hello 插件的功能区图标');
    } else {
      this.addTestResult('功能区图标', 'fail', '未找到 Hello 插件的功能区图标');
    }
  }

  private async testClickFunctionality() {
    console.log('🔍 测试点击功能...');
    
    // 查找并点击 Hello 图标
    const helloIcons = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent?.includes('👋') || el.innerHTML?.includes('👋')
    );
    
    if (helloIcons.length > 0) {
      const icon = helloIcons[0] as HTMLElement;
      
      // 记录点击前的状态
      const beforeClick = this.getCurrentState();
      
      // 模拟点击
      icon.click();
      
      // 等待点击效果
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 检查点击后的状态变化
      const afterClick = this.getCurrentState();
      
      if (afterClick.hasNotification || afterClick.hasSidebarContent || afterClick.hasEditorContent) {
        this.addTestResult('点击功能', 'pass', '点击图标后正确触发功能');
      } else {
        this.addTestResult('点击功能', 'fail', '点击图标后未检测到状态变化');
      }
    } else {
      this.addTestResult('点击功能', 'fail', '未找到可点击的 Hello 图标');
    }
  }

  private async testSidebarContent() {
    console.log('🔍 测试侧边栏内容...');
    
    // 等待侧边栏内容加载
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sidebarContent = document.querySelectorAll('[class*="sidebar"], [class*="Sidebar"]');
    let foundHelloContent = false;
    
    for (const sidebar of Array.from(sidebarContent)) {
      if (sidebar.textContent?.includes('Hello World') || 
          sidebar.textContent?.includes('Hello 插件') ||
          sidebar.innerHTML?.includes('hello-sidebar')) {
        foundHelloContent = true;
        break;
      }
    }
    
    if (foundHelloContent) {
      this.addTestResult('侧边栏内容', 'pass', '侧边栏正确显示 Hello World 内容');
    } else {
      this.addTestResult('侧边栏内容', 'fail', '侧边栏未显示 Hello World 内容');
    }
  }

  private async testEditorContent() {
    console.log('🔍 测试编辑器内容...');
    
    // 等待编辑器内容加载
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const editorContent = document.querySelectorAll('[class*="editor"], [class*="Editor"], [class*="monaco"]');
    let foundHelloContent = false;
    
    for (const editor of Array.from(editorContent)) {
      if (editor.textContent?.includes('Hello World') || 
          editor.textContent?.includes('Hello 插件') ||
          editor.innerHTML?.includes('hello-world')) {
        foundHelloContent = true;
        break;
      }
    }
    
    if (foundHelloContent) {
      this.addTestResult('编辑器内容', 'pass', '编辑器正确显示 Hello World 内容');
    } else {
      this.addTestResult('编辑器内容', 'fail', '编辑器未显示 Hello World 内容');
    }
  }

  private getConsoleLogs(): string[] {
    // 这里应该实现获取控制台日志的逻辑
    // 由于浏览器安全限制，我们无法直接获取控制台日志
    // 在实际测试中，可以通过其他方式验证
    return [];
  }

  private getCurrentState() {
    return {
      hasNotification: document.querySelector('[style*="position: fixed"][style*="top: 20px"]') !== null,
      hasSidebarContent: document.querySelector('[class*="sidebar"]')?.textContent?.includes('Hello') || false,
      hasEditorContent: document.querySelector('[class*="editor"]')?.textContent?.includes('Hello') || false
    };
  }

  private addTestResult(test: string, status: 'pass' | 'fail', message: string) {
    this.testResults.push({ test, status, message });
    console.log(`${status === 'pass' ? '✅' : '❌'} ${test}: ${message}`);
  }

  private generateReport() {
    console.log('\n📊 Hello 插件测试报告');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.status === 'pass').length;
    const failed = this.testResults.filter(r => r.status === 'fail').length;
    const total = this.testResults.length;
    
    console.log(`总测试数: ${total}`);
    console.log(`通过: ${passed} ✅`);
    console.log(`失败: ${failed} ❌`);
    console.log(`成功率: ${((passed / total) * 100).toFixed(1)}%`);
    
    console.log('\n详细结果:');
    this.testResults.forEach(result => {
      const icon = result.status === 'pass' ? '✅' : '❌';
      console.log(`${icon} ${result.test}: ${result.message}`);
    });
    
    if (failed === 0) {
      console.log('\n🎉 所有测试通过！Hello 插件工作正常。');
    } else {
      console.log('\n⚠️ 部分测试失败，请检查插件实现。');
    }
  }
}

// 自动运行测试
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const tester = new HelloPluginTester();
      tester.runTests();
    }, 2000); // 等待插件加载
  });
}
