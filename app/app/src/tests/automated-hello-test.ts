/**
 * Hello 插件自动化测试
 * 全面诊断Hello插件的问题
 */

export class AutomatedHelloTest {
  private testResults: Array<{ test: string; status: 'pass' | 'fail' | 'warning'; message: string; details?: any }> = [];
  private molecule: any = null;

  async runAutomatedTest() {
    console.log('🤖 开始Hello插件自动化测试...');
    console.log('='.repeat(50));
    
    // 等待页面完全加载
    await this.waitForPageLoad();
    
    // 运行所有测试
    await this.testMoleculeFramework();
    await this.testPluginSystem();
    await this.testHelloPlugin();
    await this.testUIElements();
    await this.testInteractions();
    
    // 生成详细报告
    this.generateDetailedReport();
    
    // 尝试修复问题
    await this.attemptFix();
  }

  private async waitForPageLoad() {
    console.log('⏳ 等待页面加载...');
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      if (document.readyState === 'complete') {
        console.log('✅ 页面加载完成');
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    // 额外等待插件系统初始化
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  private async testMoleculeFramework() {
    console.log('\n🔍 测试Molecule框架...');
    
    // 检查Molecule对象
    this.molecule = (window as any).molecule;
    const hasMolecule = !!this.molecule;
    
    this.addTestResult('Molecule全局对象', hasMolecule ? 'pass' : 'fail',
      hasMolecule ? 'Molecule对象存在' : 'Molecule对象不存在');
    
    if (hasMolecule) {
      // 检查Molecule API
      const apis = ['activityBar', 'statusBar', 'sidebar', 'editor', 'notification'];
      for (const api of apis) {
        const hasApi = !!this.molecule[api];
        this.addTestResult(`Molecule ${api} API`, hasApi ? 'pass' : 'fail',
          hasApi ? `${api} API存在` : `${api} API不存在`);
      }
      
      // 检查活动栏状态
      if (this.molecule.activityBar) {
        try {
          const activityBarState = this.molecule.activityBar.getState();
          this.addTestResult('活动栏状态', 'pass', `活动栏有${activityBarState?.data?.length || 0}个项目`);
        } catch (error) {
          this.addTestResult('活动栏状态', 'fail', `获取活动栏状态失败: ${error}`);
        }
      }
    }
  }

  private async testPluginSystem() {
    console.log('\n🔍 测试插件系统...');
    
    // 检查插件系统初始化日志
    const consoleLogs = this.getConsoleLogs();
    const hasInitLog = consoleLogs.some(log => log.includes('Initializing plugin system'));
    const hasSuccessLog = consoleLogs.some(log => log.includes('Plugin system initialized'));
    
    this.addTestResult('插件系统初始化日志', hasInitLog ? 'pass' : 'fail',
      hasInitLog ? '找到初始化日志' : '未找到初始化日志');
    
    this.addTestResult('插件系统成功日志', hasSuccessLog ? 'pass' : 'fail',
      hasSuccessLog ? '找到成功日志' : '未找到成功日志');
    
    // 检查Hello插件日志
    const hasHelloLoadLog = consoleLogs.some(log => log.includes('Hello Plugin loaded'));
    const hasHelloInitLog = consoleLogs.some(log => log.includes('Hello Plugin initialization completed'));
    
    this.addTestResult('Hello插件加载日志', hasHelloLoadLog ? 'pass' : 'fail',
      hasHelloLoadLog ? '找到Hello插件加载日志' : '未找到Hello插件加载日志');
    
    this.addTestResult('Hello插件初始化日志', hasHelloInitLog ? 'pass' : 'fail',
      hasHelloInitLog ? '找到Hello插件初始化日志' : '未找到Hello插件初始化日志');
    
    // 检查Ribbon图标日志
    const hasRibbonLog = consoleLogs.some(log => log.includes('Ribbon icon added to activity bar'));
    this.addTestResult('Ribbon图标添加日志', hasRibbonLog ? 'pass' : 'fail',
      hasRibbonLog ? '找到Ribbon图标添加日志' : '未找到Ribbon图标添加日志');
  }

  private async testHelloPlugin() {
    console.log('\n🔍 测试Hello插件...');
    
    // 查找Hello插件元素
    const allElements = Array.from(document.querySelectorAll('*'));
    
    // 查找包含 👋 的元素
    const helloElements = allElements.filter(el => 
      el.textContent?.includes('👋') || el.innerHTML?.includes('👋')
    );
    
    this.addTestResult('Hello元素存在', helloElements.length > 0 ? 'pass' : 'fail',
      `找到${helloElements.length}个包含👋的元素`);
    
    if (helloElements.length > 0) {
      helloElements.forEach((el, index) => {
        const text = el.textContent?.substring(0, 30) || '';
        const tag = el.tagName;
        this.addTestResult(`Hello元素${index + 1}`, 'pass', `${tag}: "${text}"`);
      });
    }
    
    // 查找Hello Plugin文本
    const helloTextElements = allElements.filter(el => 
      el.textContent?.includes('Hello Plugin')
    );
    
    this.addTestResult('Hello Plugin文本', helloTextElements.length > 0 ? 'pass' : 'fail',
      `找到${helloTextElements.length}个包含"Hello Plugin"的元素`);
  }

  private async testUIElements() {
    console.log('\n🔍 测试UI元素...');
    
    // 测试活动栏
    await this.testActivityBar();
    
    // 测试状态栏
    await this.testStatusBar();
    
    // 测试侧边栏
    await this.testSidebar();
  }

  private async testActivityBar() {
    if (!this.molecule?.activityBar) {
      this.addTestResult('活动栏API', 'fail', '活动栏API不可用');
      return;
    }
    
    try {
      const activityBarState = this.molecule.activityBar.getState();
      const items = activityBarState?.data || [];
      
      this.addTestResult('活动栏项目数量', 'pass', `活动栏有${items.length}个项目`);
      
      // 查找Hello图标
      const helloItem = items.find((item: any) => 
        item.name?.includes('Hello') || item.icon?.includes('👋')
      );
      
      this.addTestResult('Hello活动栏项目', helloItem ? 'pass' : 'fail',
        helloItem ? `找到Hello项目: ${helloItem.name}` : '未找到Hello活动栏项目');
      
      // 检查DOM中的活动栏元素
      const activityBarSelectors = [
        '[class*="activity"]',
        '[class*="Activity"]',
        '[class*="activityBar"]'
      ];
      
      let foundActivityBar = false;
      for (const selector of activityBarSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          foundActivityBar = true;
          this.addTestResult('活动栏DOM元素', 'pass', `找到活动栏: ${selector}`);
          break;
        }
      }
      
      if (!foundActivityBar) {
        this.addTestResult('活动栏DOM元素', 'fail', '未找到活动栏DOM元素');
      }
      
    } catch (error) {
      this.addTestResult('活动栏测试', 'fail', `活动栏测试失败: ${error}`);
    }
  }

  private async testStatusBar() {
    if (!this.molecule?.statusBar) {
      this.addTestResult('状态栏API', 'fail', '状态栏API不可用');
      return;
    }
    
    try {
      const statusBarState = this.molecule.statusBar.getState();
      const items = statusBarState?.data || [];
      
      this.addTestResult('状态栏项目数量', 'pass', `状态栏有${items.length}个项目`);
      
      // 查找Hello状态栏项目
      const helloItem = items.find((item: any) => 
        item.name?.includes('Hello') || item.render?.toString().includes('👋')
      );
      
      this.addTestResult('Hello状态栏项目', helloItem ? 'pass' : 'fail',
        helloItem ? `找到Hello状态栏项目: ${helloItem.name}` : '未找到Hello状态栏项目');
      
    } catch (error) {
      this.addTestResult('状态栏测试', 'fail', `状态栏测试失败: ${error}`);
    }
  }

  private async testSidebar() {
    if (!this.molecule?.sidebar) {
      this.addTestResult('侧边栏API', 'fail', '侧边栏API不可用');
      return;
    }
    
    try {
      const sidebarState = this.molecule.sidebar.getState();
      const items = sidebarState?.data || [];
      
      this.addTestResult('侧边栏项目数量', 'pass', `侧边栏有${items.length}个项目`);
      
      // 查找Hello侧边栏项目
      const helloItem = items.find((item: any) => 
        item.name?.includes('Hello') || item.id?.includes('hello')
      );
      
      this.addTestResult('Hello侧边栏项目', helloItem ? 'pass' : 'fail',
        helloItem ? `找到Hello侧边栏项目: ${helloItem.name}` : '未找到Hello侧边栏项目');
      
    } catch (error) {
      this.addTestResult('侧边栏测试', 'fail', `侧边栏测试失败: ${error}`);
    }
  }

  private async testInteractions() {
    console.log('\n🔍 测试交互功能...');
    
    // 尝试点击Hello图标
    await this.testHelloIconClick();
    
    // 测试命令执行
    await this.testCommandExecution();
  }

  private async testHelloIconClick() {
    // 查找可点击的Hello元素
    const clickableElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const hasClick = el.textContent?.includes('👋') || el.innerHTML?.includes('👋');
      const isVisible = (el as HTMLElement).offsetWidth > 0 && (el as HTMLElement).offsetHeight > 0;
      const isClickable = el.onclick || el.getAttribute('role') === 'button';
      return hasClick && isVisible && isClickable;
    });
    
    this.addTestResult('可点击Hello元素', clickableElements.length > 0 ? 'pass' : 'fail',
      `找到${clickableElements.length}个可点击的Hello元素`);
    
    if (clickableElements.length > 0) {
      // 尝试点击第一个元素
      try {
        const element = clickableElements[0] as HTMLElement;
        element.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 检查是否有通知出现
        const notifications = document.querySelectorAll('[style*="position: fixed"][style*="top: 20px"]');
        this.addTestResult('Hello点击通知', notifications.length > 0 ? 'pass' : 'fail',
          notifications.length > 0 ? '点击后出现通知' : '点击后未出现通知');
        
      } catch (error) {
        this.addTestResult('Hello点击测试', 'fail', `点击测试失败: ${error}`);
      }
    }
  }

  private async testCommandExecution() {
    if (!this.molecule?.commands) {
      this.addTestResult('命令API', 'fail', '命令API不可用');
      return;
    }
    
    try {
      // 尝试执行Hello命令
      const success = this.molecule.commands.executeCommandById('hello-show-message');
      this.addTestResult('Hello命令执行', success ? 'pass' : 'fail',
        success ? 'Hello命令执行成功' : 'Hello命令执行失败');
    } catch (error) {
      this.addTestResult('Hello命令执行', 'fail', `命令执行失败: ${error}`);
    }
  }

  private getConsoleLogs(): string[] {
    // 这里我们无法直接获取控制台日志，但可以检查一些关键元素
    return [];
  }

  private addTestResult(test: string, status: 'pass' | 'fail' | 'warning', message: string, details?: any) {
    this.testResults.push({ test, status, message, details });
    const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
    console.log(`${icon} ${test}: ${message}`);
  }

  private generateDetailedReport() {
    console.log('\n📊 Hello插件自动化测试报告');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.status === 'pass').length;
    const failed = this.testResults.filter(r => r.status === 'fail').length;
    const warnings = this.testResults.filter(r => r.status === 'warning').length;
    const total = this.testResults.length;
    
    console.log(`总测试数: ${total}`);
    console.log(`通过: ${passed} ✅`);
    console.log(`失败: ${failed} ❌`);
    console.log(`警告: ${warnings} ⚠️`);
    console.log(`成功率: ${((passed / total) * 100).toFixed(1)}%`);
    
    console.log('\n详细结果:');
    this.testResults.forEach(result => {
      const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
      console.log(`${icon} ${result.test}: ${result.message}`);
    });
    
    // 分析问题
    this.analyzeProblems();
  }

  private analyzeProblems() {
    console.log('\n🔍 问题分析:');
    
    const failedTests = this.testResults.filter(r => r.status === 'fail');
    
    if (failedTests.length === 0) {
      console.log('🎉 所有测试通过！Hello插件应该正常工作。');
      return;
    }
    
    console.log(`发现 ${failedTests.length} 个问题:`);
    
    failedTests.forEach((test, index) => {
      console.log(`${index + 1}. ${test.test}: ${test.message}`);
    });
    
    // 提供解决方案
    this.provideSolutions(failedTests);
  }

  private provideSolutions(failedTests: any[]) {
    console.log('\n🔧 建议的解决方案:');
    
    const testNames = failedTests.map(t => t.test);
    
    if (testNames.includes('Molecule全局对象')) {
      console.log('1. 检查Molecule框架是否正确加载');
      console.log('2. 确认应用启动时没有JavaScript错误');
    }
    
    if (testNames.includes('Hello插件加载日志')) {
      console.log('3. 检查插件系统是否正确初始化');
      console.log('4. 确认Hello插件已正确注册');
    }
    
    if (testNames.includes('Ribbon图标添加日志')) {
      console.log('5. 检查addRibbonIcon方法是否正确实现');
      console.log('6. 确认Molecule活动栏API可用');
    }
    
    if (testNames.includes('Hello活动栏项目')) {
      console.log('7. 检查活动栏项目是否正确添加');
      console.log('8. 确认图标ID没有冲突');
    }
    
    console.log('\n📝 调试命令:');
    console.log('// 检查Molecule对象');
    console.log('console.log(window.molecule);');
    console.log('// 检查活动栏状态');
    console.log('console.log(window.molecule?.activityBar?.getState());');
    console.log('// 手动添加Hello图标');
    console.log('window.molecule?.activityBar?.add({id: "hello-test", name: "Hello Test", icon: "👋"});');
  }

  private async attemptFix() {
    console.log('\n🔧 尝试自动修复...');
    
    const failedTests = this.testResults.filter(r => r.status === 'fail');
    
    if (failedTests.length === 0) {
      console.log('✅ 无需修复，所有测试通过');
      return;
    }
    
    // 尝试修复Molecule对象问题
    if (failedTests.some(t => t.test.includes('Molecule'))) {
      console.log('尝试修复Molecule对象问题...');
      // 这里可以添加自动修复逻辑
    }
    
    // 尝试手动添加Hello图标
    if (failedTests.some(t => t.test.includes('Hello活动栏项目'))) {
      console.log('尝试手动添加Hello图标...');
      if (this.molecule?.activityBar) {
        try {
          this.molecule.activityBar.add({
            id: 'hello-manual-fix',
            name: 'Hello Manual Fix',
            icon: '👋',
            alignment: 'top',
            sortIndex: 10
          });
          console.log('✅ 手动添加Hello图标成功');
        } catch (error) {
          console.log('❌ 手动添加Hello图标失败:', error);
        }
      }
    }
    
    console.log('🔧 自动修复完成');
  }
}

// 自动运行测试
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const test = new AutomatedHelloTest();
      test.runAutomatedTest();
    }, 2000);
  });
}

// 手动运行测试
(window as any).automatedHelloTest = () => {
  const test = new AutomatedHelloTest();
  test.runAutomatedTest();
};
