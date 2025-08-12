/**
 * 插件系统测试
 * 用于验证插件系统是否正确初始化和加载
 */

export class PluginSystemTester {
  async testPluginSystem() {
    console.log('🧪 开始测试插件系统...');
    console.log('='.repeat(50));
    
    // 等待页面加载
    await this.waitForPageLoad();
    
    // 检查插件系统初始化
    await this.checkPluginSystemInitialization();
    
    // 检查Hello插件
    await this.checkHelloPlugin();
    
    // 生成测试报告
    this.generateTestReport();
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
  }

  private async checkPluginSystemInitialization() {
    console.log('\n🔍 检查插件系统初始化...');
    
    // 等待插件系统初始化
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 检查控制台日志
    console.log('📝 检查控制台日志...');
    console.log('请查看控制台是否有以下日志:');
    console.log('  - "Starting plugin system initialization..."');
    console.log('  - "Plugin system initialized successfully"');
    console.log('  - "Hello Plugin loaded!"');
    console.log('  - "Hello Plugin initialization completed"');
    
    // 检查全局对象
    const hasMolecule = typeof (window as any).molecule !== 'undefined';
    console.log(`✅ Molecule 全局对象: ${hasMolecule ? '存在' : '不存在'}`);
    
    if (hasMolecule) {
      const molecule = (window as any).molecule;
      console.log('📋 Molecule 对象属性:');
      console.log('  - activityBar:', !!molecule.activityBar);
      console.log('  - sidebar:', !!molecule.sidebar);
      console.log('  - editor:', !!molecule.editor);
      console.log('  - notification:', !!molecule.notification);
    }
  }

  private async checkHelloPlugin() {
    console.log('\n🔍 检查 Hello 插件...');
    
    // 等待更长时间让插件完全加载
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 检查DOM中的Hello插件元素
    const allElements = Array.from(document.querySelectorAll('*'));
    
    // 查找Hello插件相关元素
    const helloElements = allElements.filter(el => 
      el.textContent?.includes('Hello Plugin') || 
      el.textContent?.includes('hello-plugin') ||
      el.textContent?.includes('👋')
    );
    
    console.log(`📊 找到 ${helloElements.length} 个 Hello 插件相关元素`);
    
    if (helloElements.length > 0) {
      helloElements.forEach((el, index) => {
        console.log(`  ${index + 1}. ${el.tagName} - ${el.textContent?.substring(0, 50)}`);
      });
    } else {
      console.log('❌ 未找到 Hello 插件相关元素');
    }
    
    // 检查状态栏
    const statusBarElements = allElements.filter(el => 
      el.textContent?.includes('👋 Hello Plugin')
    );
    
    console.log(`📊 状态栏中的 Hello 元素: ${statusBarElements.length} 个`);
    
    // 检查活动栏图标
    const iconElements = allElements.filter(el => 
      el.textContent?.includes('👋') && 
      (el.closest('[class*="activity"]') || el.closest('[class*="Activity"]'))
    );
    
    console.log(`📊 活动栏中的 Hello 图标: ${iconElements.length} 个`);
  }

  private generateTestReport() {
    console.log('\n📊 插件系统测试报告');
    console.log('='.repeat(50));
    
    console.log('🔧 如果插件没有显示，请尝试以下步骤:');
    console.log('1. 刷新页面 (Ctrl+F5 或 Cmd+Shift+R)');
    console.log('2. 检查浏览器控制台是否有错误信息');
    console.log('3. 确认 TypeScript 编译是否成功');
    console.log('4. 检查网络请求是否正常');
    console.log('5. 清除浏览器缓存');
    
    console.log('\n📝 手动测试步骤:');
    console.log('1. 打开浏览器开发者工具 (F12)');
    console.log('2. 查看 Console 标签页');
    console.log('3. 查找 "Hello Plugin" 相关的日志');
    console.log('4. 在 Console 中运行: debugHelloPlugin()');
    
    console.log('\n🎯 预期结果:');
    console.log('- 状态栏显示 "👋 Hello Plugin"');
    console.log('- 左侧活动栏有 👋 图标');
    console.log('- 点击图标后显示通知和内容');
  }
}

// 自动运行测试
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const tester = new PluginSystemTester();
      tester.testPluginSystem();
    }, 2000);
  });
}

// 手动运行测试的函数
(window as any).testPluginSystem = () => {
  const tester = new PluginSystemTester();
  tester.testPluginSystem();
};
