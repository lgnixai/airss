/**
 * 页面诊断脚本
 * 用于诊断页面空白问题
 */

export class PageDiagnosis {
  async diagnosePage() {
    console.log('🔍 开始页面诊断...');
    console.log('='.repeat(50));
    
    // 检查页面基本状态
    await this.checkPageBasicState();
    
    // 检查JavaScript错误
    await this.checkJavaScriptErrors();
    
    // 检查Molecule框架
    await this.checkMoleculeFramework();
    
    // 检查插件系统
    await this.checkPluginSystem();
    
    // 检查DOM结构
    await this.checkDOMStructure();
    
    // 生成诊断报告
    this.generateDiagnosisReport();
  }

  private async checkPageBasicState() {
    console.log('\n🔍 检查页面基本状态...');
    
    // 检查页面加载状态
    const readyState = document.readyState;
    console.log(`📊 页面加载状态: ${readyState}`);
    
    // 检查页面标题
    const title = document.title;
    console.log(`📊 页面标题: ${title}`);
    
    // 检查body元素
    const body = document.body;
    const hasBody = !!body;
    const bodyChildren = body?.children?.length || 0;
    
    console.log(`📊 Body元素存在: ${hasBody}`);
    console.log(`📊 Body子元素数量: ${bodyChildren}`);
    
    // 检查根元素
    const root = document.getElementById('root');
    const hasRoot = !!root;
    const rootChildren = root?.children?.length || 0;
    
    console.log(`📊 Root元素存在: ${hasRoot}`);
    console.log(`📊 Root子元素数量: ${rootChildren}`);
    
    if (hasRoot && rootChildren === 0) {
      console.log('⚠️ Root元素存在但没有子元素 - 这可能是页面空白的原因');
    }
  }

  private async checkJavaScriptErrors() {
    console.log('\n🔍 检查JavaScript错误...');
    
    // 检查控制台错误
    const originalError = console.error;
    const errors: string[] = [];
    
    console.error = (...args: any[]) => {
      errors.push(args.join(' '));
      originalError.apply(console, args);
    };
    
    // 等待一段时间收集错误
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`📊 检测到 ${errors.length} 个JavaScript错误`);
    
    if (errors.length > 0) {
      console.log('❌ JavaScript错误列表:');
      errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ 没有检测到JavaScript错误');
    }
    
    // 恢复原始console.error
    console.error = originalError;
  }

  private async checkMoleculeFramework() {
    console.log('\n🔍 检查Molecule框架...');
    
    // 等待页面完全加载
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 检查Molecule对象
    const molecule = (window as any).molecule;
    const hasMolecule = !!molecule;
    
    console.log(`📊 Molecule对象存在: ${hasMolecule}`);
    
    if (hasMolecule) {
      console.log('✅ Molecule框架已加载');
      
      // 检查Molecule API
      const apis = ['activityBar', 'statusBar', 'sidebar', 'editor', 'notification'];
      for (const api of apis) {
        const hasApi = !!molecule[api];
        console.log(`📊 ${api} API: ${hasApi ? '✅' : '❌'}`);
      }
    } else {
      console.log('❌ Molecule框架未加载 - 这可能是页面空白的主要原因');
    }
  }

  private async checkPluginSystem() {
    console.log('\n🔍 检查插件系统...');
    
    // 等待更长时间让插件系统初始化
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 检查插件系统相关对象
    const pluginSystem = (window as any).pluginSystem;
    const hasPluginSystem = !!pluginSystem;
    
    console.log(`📊 插件系统对象存在: ${hasPluginSystem}`);
    
    // 检查控制台日志中的插件相关信息
    console.log('📝 请检查控制台是否有以下日志:');
    console.log('  - "Initializing plugin system..."');
    console.log('  - "Plugin system initialized successfully"');
    console.log('  - "Hello Plugin loaded!"');
  }

  private async checkDOMStructure() {
    console.log('\n🔍 检查DOM结构...');
    
    // 检查页面结构
    const html = document.documentElement;
    const head = document.head;
    const body = document.body;
    
    console.log(`📊 HTML元素: ${!!html}`);
    console.log(`📊 Head元素: ${!!head}`);
    console.log(`📊 Body元素: ${!!body}`);
    
    // 检查关键元素
    const root = document.getElementById('root');
    if (root) {
      console.log('📊 Root元素内容:');
      console.log(`  - innerHTML长度: ${root.innerHTML.length}`);
      console.log(`  - 子元素数量: ${root.children.length}`);
      
      if (root.innerHTML.length === 0) {
        console.log('❌ Root元素为空 - 这是页面空白的原因');
      }
    }
    
    // 检查是否有React错误边界
    const errorBoundaries = document.querySelectorAll('[data-reactroot], [data-reactid]');
    console.log(`📊 React相关元素: ${errorBoundaries.length} 个`);
    
    // 检查是否有错误信息
    const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"], [id*="error"], [id*="Error"]');
    console.log(`📊 错误相关元素: ${errorElements.length} 个`);
    
    if (errorElements.length > 0) {
      console.log('⚠️ 发现可能的错误元素:');
      errorElements.forEach((el, index) => {
        console.log(`  ${index + 1}. ${el.tagName} - ${el.className || el.id}`);
      });
    }
  }

  private generateDiagnosisReport() {
    console.log('\n📊 页面诊断报告');
    console.log('='.repeat(50));
    
    console.log('🔍 可能的问题原因:');
    console.log('1. JavaScript错误导致页面渲染失败');
    console.log('2. Molecule框架未正确加载');
    console.log('3. React组件渲染失败');
    console.log('4. 插件系统初始化失败');
    console.log('5. 网络请求失败');
    
    console.log('\n🔧 建议的解决步骤:');
    console.log('1. 刷新页面 (Ctrl+F5 或 Cmd+Shift+R)');
    console.log('2. 清除浏览器缓存');
    console.log('3. 检查网络连接');
    console.log('4. 查看浏览器控制台错误');
    console.log('5. 重启开发服务器');
    
    console.log('\n📝 调试命令:');
    console.log('// 检查页面状态');
    console.log('console.log(document.readyState);');
    console.log('console.log(document.getElementById("root"));');
    console.log('// 检查Molecule对象');
    console.log('console.log(window.molecule);');
    console.log('// 检查错误');
    console.log('console.log(window.onerror);');
    
    console.log('\n🎯 如果问题持续存在，请:');
    console.log('1. 分享浏览器控制台的完整错误信息');
    console.log('2. 检查网络请求是否正常');
    console.log('3. 确认所有依赖都已正确安装');
    console.log('4. 尝试在不同的浏览器中测试');
  }
}

// 自动运行诊断
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const diagnosis = new PageDiagnosis();
      diagnosis.diagnosePage();
    }, 1000);
  });
}

// 手动运行诊断
(window as any).diagnosePage = () => {
  const diagnosis = new PageDiagnosis();
  diagnosis.diagnosePage();
};
