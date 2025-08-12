/**
 * 简单的Hello插件测试
 * 用于快速验证Hello插件是否正常工作
 */

export class SimpleHelloTest {
  async runTest() {
    console.log('🧪 开始简单Hello插件测试...');
    console.log('='.repeat(40));
    
    // 等待页面加载
    await this.waitForPageLoad();
    
    // 检查插件系统
    await this.checkPluginSystem();
    
    // 检查Hello插件
    await this.checkHelloPlugin();
    
    // 生成报告
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
  }

  private async checkPluginSystem() {
    console.log('\n🔍 检查插件系统...');
    
    // 等待插件系统初始化
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 检查Molecule对象
    const hasMolecule = typeof (window as any).molecule !== 'undefined';
    console.log(`✅ Molecule对象: ${hasMolecule ? '存在' : '不存在'}`);
    
    if (hasMolecule) {
      const molecule = (window as any).molecule;
      console.log('📋 Molecule API检查:');
      console.log(`  - activityBar: ${!!molecule.activityBar}`);
      console.log(`  - sidebar: ${!!molecule.sidebar}`);
      console.log(`  - editor: ${!!molecule.editor}`);
      console.log(`  - notification: ${!!molecule.notification}`);
    }
  }

  private async checkHelloPlugin() {
    console.log('\n🔍 检查Hello插件...');
    
    // 等待更长时间让插件完全加载
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 查找Hello插件元素
    const allElements = Array.from(document.querySelectorAll('*'));
    
    // 查找包含 👋 的元素
    const helloElements = allElements.filter(el => 
      el.textContent?.includes('👋') || el.innerHTML?.includes('👋')
    );
    
    console.log(`📊 找到 ${helloElements.length} 个包含 👋 的元素`);
    
    if (helloElements.length > 0) {
      console.log('✅ Hello插件元素存在');
      helloElements.forEach((el, index) => {
        const text = el.textContent?.substring(0, 30) || '';
        const tag = el.tagName;
        const className = el.className || '';
        console.log(`  ${index + 1}. ${tag} - "${text}" (${className})`);
      });
    } else {
      console.log('❌ 未找到Hello插件元素');
    }
    
    // 查找Hello Plugin文本
    const helloTextElements = allElements.filter(el => 
      el.textContent?.includes('Hello Plugin')
    );
    
    console.log(`📊 找到 ${helloTextElements.length} 个包含 "Hello Plugin" 的元素`);
    
    // 查找状态栏
    const statusBarElements = allElements.filter(el => 
      el.textContent?.includes('👋 Hello Plugin')
    );
    
    console.log(`📊 状态栏中的Hello元素: ${statusBarElements.length} 个`);
    
    // 查找活动栏图标
    const activityBarSelectors = [
      '[class*="activity"]',
      '[class*="Activity"]',
      '[class*="activityBar"]'
    ];
    
    let foundActivityBar = false;
    let foundHelloIcon = false;
    
    for (const selector of activityBarSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        foundActivityBar = true;
        console.log(`✅ 找到活动栏: ${selector}`);
        
        // 检查活动栏中的Hello图标
        for (const element of Array.from(elements)) {
          if (element.textContent?.includes('👋') || 
              element.innerHTML?.includes('👋')) {
            foundHelloIcon = true;
            console.log('✅ 找到Hello插件图标');
            break;
          }
        }
        break;
      }
    }
    
    console.log(`📊 活动栏存在: ${foundActivityBar}`);
    console.log(`📊 Hello图标存在: ${foundHelloIcon}`);
  }

  private generateReport() {
    console.log('\n📊 测试报告');
    console.log('='.repeat(40));
    
    console.log('🎯 如果看不到Hello插件，请尝试:');
    console.log('1. 刷新页面 (Ctrl+F5)');
    console.log('2. 检查控制台错误');
    console.log('3. 运行 debugHelloPlugin() 进行详细调试');
    
    console.log('\n📝 在控制台运行以下命令进行详细检查:');
    console.log('debugHelloPlugin()');
    console.log('testPluginSystem()');
    
    console.log('\n🔍 手动检查命令:');
    console.log('// 查找所有Hello元素');
    console.log('Array.from(document.querySelectorAll("*")).filter(el => el.textContent?.includes("👋"))');
    
    console.log('\n// 查找状态栏');
    console.log('document.querySelectorAll("[class*=\\"status\\"]")');
    
    console.log('\n// 查找活动栏');
    console.log('document.querySelectorAll("[class*=\\"activity\\"]")');
  }
}

// 自动运行测试
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const test = new SimpleHelloTest();
      test.runTest();
    }, 1000);
  });
}

// 手动运行测试
(window as any).simpleHelloTest = () => {
  const test = new SimpleHelloTest();
  test.runTest();
};
