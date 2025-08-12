/**
 * Hello 插件调试脚本
 * 用于诊断 Hello 插件是否正确加载和显示
 */

export class HelloPluginDebugger {
  private debugResults: Array<{ test: string; status: 'pass' | 'fail' | 'warning'; message: string; details?: any }> = [];

  async runDebug() {
    console.log('🔍 开始调试 Hello 插件...');
    console.log('='.repeat(60));
    
    // 等待页面完全加载
    await this.waitForPageLoad();
    
    // 运行调试检查
    await this.checkPluginSystem();
    await this.checkPluginRegistration();
    await this.checkPluginLoading();
    await this.checkStatusBar();
    await this.checkRibbonIcon();
    await this.checkMoleculeContext();
    await this.checkDOMStructure();
    
    // 生成调试报告
    this.generateDebugReport();
    
    // 尝试手动触发插件功能
    await this.tryManualTrigger();
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
    
    if (attempts >= maxAttempts) {
      console.warn('⚠️ 页面加载超时');
    }
  }

  private async checkPluginSystem() {
    console.log('\n🔍 检查插件系统...');
    
    // 检查全局对象
    const hasMolecule = typeof (window as any).molecule !== 'undefined';
    const hasPluginSystem = typeof (window as any).pluginSystem !== 'undefined';
    
    this.addDebugResult('Molecule 全局对象', hasMolecule ? 'pass' : 'fail', 
      hasMolecule ? 'Molecule 全局对象存在' : 'Molecule 全局对象不存在');
    
    this.addDebugResult('插件系统全局对象', hasPluginSystem ? 'pass' : 'fail',
      hasPluginSystem ? '插件系统全局对象存在' : '插件系统全局对象不存在');
    
    // 检查控制台日志
    console.log('📝 请检查控制台是否有以下日志:');
    console.log('  - "Initializing plugin system..."');
    console.log('  - "Hello Plugin loaded!"');
    console.log('  - "Hello Plugin initialization completed"');
  }

  private async checkPluginRegistration() {
    console.log('\n🔍 检查插件注册...');
    
    // 检查插件系统服务
    const pluginSystemElements = document.querySelectorAll('*');
    let foundPluginSystem = false;
    
    for (const element of Array.from(pluginSystemElements)) {
      if (element.textContent?.includes('Plugin System') || 
          element.textContent?.includes('plugin system')) {
        foundPluginSystem = true;
        break;
      }
    }
    
    this.addDebugResult('插件系统服务', foundPluginSystem ? 'pass' : 'warning',
      foundPluginSystem ? '找到插件系统相关元素' : '未找到插件系统相关元素');
  }

  private async checkPluginLoading() {
    console.log('\n🔍 检查插件加载状态...');
    
    // 检查是否有 Hello 插件相关的日志或元素
    const allElements = document.querySelectorAll('*');
    let foundHelloElements = false;
    let foundHelloText = false;
    
    for (const element of Array.from(allElements)) {
      if (element.textContent?.includes('Hello Plugin') || 
          element.textContent?.includes('hello-plugin')) {
        foundHelloElements = true;
        foundHelloText = true;
        break;
      }
    }
    
    this.addDebugResult('Hello 插件元素', foundHelloElements ? 'pass' : 'fail',
      foundHelloElements ? '找到 Hello 插件相关元素' : '未找到 Hello 插件相关元素');
    
    this.addDebugResult('Hello 插件文本', foundHelloText ? 'pass' : 'fail',
      foundHelloText ? '找到 Hello 插件相关文本' : '未找到 Hello 插件相关文本');
  }

  private async checkStatusBar() {
    console.log('\n🔍 检查状态栏...');
    
    // 查找状态栏
    const statusBarSelectors = [
      '[class*="status"]',
      '[class*="Status"]',
      '[class*="statusBar"]',
      '[class*="status-bar"]',
      '.mo-statusBar',
      '.status-bar'
    ];
    
    let foundStatusBar = false;
    let foundHelloStatus = false;
    
    for (const selector of statusBarSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        foundStatusBar = true;
        console.log(`✅ 找到状态栏: ${selector}`);
        
        // 检查状态栏中的 Hello 文本
        for (const element of Array.from(elements)) {
          if (element.textContent?.includes('👋') || 
              element.textContent?.includes('Hello Plugin')) {
            foundHelloStatus = true;
            console.log('✅ 找到 Hello 插件状态栏文本');
            break;
          }
        }
        break;
      }
    }
    
    this.addDebugResult('状态栏存在', foundStatusBar ? 'pass' : 'fail',
      foundStatusBar ? '找到状态栏元素' : '未找到状态栏元素');
    
    this.addDebugResult('Hello 状态栏文本', foundHelloStatus ? 'pass' : 'fail',
      foundHelloStatus ? '状态栏显示 Hello 插件信息' : '状态栏未显示 Hello 插件信息');
  }

  private async checkRibbonIcon() {
    console.log('\n🔍 检查功能区图标...');
    
    // 查找活动栏和图标
    const activityBarSelectors = [
      '[class*="activity"]',
      '[class*="Activity"]',
      '[class*="activityBar"]',
      '[class*="ribbon"]',
      '[class*="Ribbon"]',
      '.mo-activityBar',
      '.activity-bar'
    ];
    
    let foundActivityBar = false;
    let foundHelloIcon = false;
    
    for (const selector of activityBarSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        foundActivityBar = true;
        console.log(`✅ 找到活动栏: ${selector}`);
        
        // 检查活动栏中的 Hello 图标
        for (const element of Array.from(elements)) {
          if (element.textContent?.includes('👋') || 
              element.innerHTML?.includes('👋') ||
              element.textContent?.includes('Hello')) {
            foundHelloIcon = true;
            console.log('✅ 找到 Hello 插件图标');
            break;
          }
        }
        break;
      }
    }
    
    this.addDebugResult('活动栏存在', foundActivityBar ? 'pass' : 'fail',
      foundActivityBar ? '找到活动栏元素' : '未找到活动栏元素');
    
    this.addDebugResult('Hello 图标', foundHelloIcon ? 'pass' : 'fail',
      foundHelloIcon ? '找到 Hello 插件图标' : '未找到 Hello 插件图标');
    
    // 如果没有找到图标，尝试查找所有包含 👋 的元素
    if (!foundHelloIcon) {
      console.log('🔍 搜索所有包含 👋 的元素...');
      const allElements = Array.from(document.querySelectorAll('*'));
      const helloElements = allElements.filter(el => 
        el.textContent?.includes('👋') || el.innerHTML?.includes('👋')
      );
      
      if (helloElements.length > 0) {
        console.log(`✅ 找到 ${helloElements.length} 个包含 👋 的元素:`);
        helloElements.forEach((el, index) => {
          console.log(`  ${index + 1}. ${el.tagName} - ${el.textContent?.substring(0, 50)}`);
        });
      } else {
        console.log('❌ 未找到任何包含 👋 的元素');
      }
    }
  }

  private async checkMoleculeContext() {
    console.log('\n🔍 检查 Molecule 上下文...');
    
    // 检查 Molecule 相关的全局变量和对象
    const moleculeGlobals = [
      'molecule',
      'Molecule',
      'moleculeContext',
      'pluginSystem'
    ];
    
    for (const global of moleculeGlobals) {
      const exists = typeof (window as any)[global] !== 'undefined';
      this.addDebugResult(`全局对象 ${global}`, exists ? 'pass' : 'warning',
        exists ? `全局对象 ${global} 存在` : `全局对象 ${global} 不存在`);
    }
  }

  private async checkDOMStructure() {
    console.log('\n🔍 检查 DOM 结构...');
    
    // 检查页面的基本结构
    const body = document.body;
    const hasBody = !!body;
    const bodyChildren = body?.children?.length || 0;
    
    this.addDebugResult('Body 元素', hasBody ? 'pass' : 'fail',
      hasBody ? 'Body 元素存在' : 'Body 元素不存在');
    
    this.addDebugResult('Body 子元素', bodyChildren > 0 ? 'pass' : 'warning',
      `Body 有 ${bodyChildren} 个子元素`);
    
    // 输出 DOM 结构概览
    console.log('📋 DOM 结构概览:');
    if (body) {
      Array.from(body.children).forEach((child, index) => {
        console.log(`  ${index + 1}. ${child.tagName} - ${child.className}`);
      });
    }
  }

  private async tryManualTrigger() {
    console.log('\n🔍 尝试手动触发插件功能...');
    
    // 查找所有可能的 Hello 图标并尝试点击
    const helloElements = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent?.includes('👋') || el.innerHTML?.includes('👋')
    );
    
    if (helloElements.length > 0) {
      console.log(`找到 ${helloElements.length} 个可能的 Hello 元素，尝试点击...`);
      
      for (let i = 0; i < Math.min(helloElements.length, 3); i++) {
        const element = helloElements[i] as HTMLElement;
        console.log(`点击元素 ${i + 1}: ${element.tagName} - ${element.textContent?.substring(0, 30)}`);
        
        try {
          element.click();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // 检查是否有变化
          const hasNotification = document.querySelector('[style*="position: fixed"][style*="top: 20px"]') !== null;
          if (hasNotification) {
            console.log('✅ 点击成功！检测到通知消息');
            break;
          }
        } catch (error) {
          console.log(`❌ 点击元素 ${i + 1} 失败:`, error);
        }
      }
    } else {
      console.log('❌ 未找到可点击的 Hello 元素');
    }
  }

  private addDebugResult(test: string, status: 'pass' | 'fail' | 'warning', message: string, details?: any) {
    this.debugResults.push({ test, status, message, details });
    const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
    console.log(`${icon} ${test}: ${message}`);
  }

  private generateDebugReport() {
    console.log('\n📊 Hello 插件调试报告');
    console.log('='.repeat(60));
    
    const passed = this.debugResults.filter(r => r.status === 'pass').length;
    const failed = this.debugResults.filter(r => r.status === 'fail').length;
    const warnings = this.debugResults.filter(r => r.status === 'warning').length;
    const total = this.debugResults.length;
    
    console.log(`总检查数: ${total}`);
    console.log(`通过: ${passed} ✅`);
    console.log(`失败: ${failed} ❌`);
    console.log(`警告: ${warnings} ⚠️`);
    console.log(`成功率: ${((passed / total) * 100).toFixed(1)}%`);
    
    console.log('\n详细结果:');
    this.debugResults.forEach(result => {
      const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
      console.log(`${icon} ${result.test}: ${result.message}`);
    });
    
    console.log('\n🔧 建议的解决步骤:');
    if (failed > 0) {
      console.log('1. 检查控制台是否有错误信息');
      console.log('2. 确认插件是否正确注册在 PluginSystemService 中');
      console.log('3. 验证 TypeScript 编译是否成功');
      console.log('4. 检查 Molecule 框架是否正确加载');
      console.log('5. 确认浏览器缓存是否已清除');
    } else {
      console.log('🎉 所有检查通过！插件应该正常工作。');
    }
  }
}

// 自动运行调试
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const debuggerInstance = new HelloPluginDebugger();
      debuggerInstance.runDebug();
    }, 3000); // 等待插件加载
  });
}

// 手动运行调试的函数
(window as any).debugHelloPlugin = () => {
  const debuggerInstance = new HelloPluginDebugger();
  debuggerInstance.runDebug();
};
