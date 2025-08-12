/**
 * 基本功能测试
 * 检查页面是否正常工作
 */

export class BasicFunctionalityTest {
  async testBasicFunctionality() {
    console.log('🧪 开始基本功能测试...');
    console.log('='.repeat(40));
    
    // 等待页面加载
    await this.waitForPageLoad();
    
    // 测试基本DOM功能
    await this.testBasicDOM();
    
    // 测试React功能
    await this.testReactFunctionality();
    
    // 测试Molecule功能
    await this.testMoleculeFunctionality();
    
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

  private async testBasicDOM() {
    console.log('\n🔍 测试基本DOM功能...');
    
    // 测试基本DOM操作
    try {
      const testElement = document.createElement('div');
      testElement.id = 'test-element';
      testElement.textContent = 'Test Element';
      document.body.appendChild(testElement);
      
      const foundElement = document.getElementById('test-element');
      const testPassed = foundElement && foundElement.textContent === 'Test Element';
      
      console.log(`✅ DOM操作测试: ${testPassed ? '通过' : '失败'}`);
      
      // 清理测试元素
      if (foundElement) {
        foundElement.remove();
      }
    } catch (error) {
      console.log(`❌ DOM操作测试失败: ${error}`);
    }
    
    // 测试页面结构
    const root = document.getElementById('root');
    const hasRoot = !!root;
    console.log(`📊 Root元素存在: ${hasRoot}`);
    
    if (hasRoot) {
      console.log(`📊 Root内容长度: ${root.innerHTML.length}`);
      console.log(`📊 Root子元素数量: ${root.children.length}`);
    }
  }

  private async testReactFunctionality() {
    console.log('\n🔍 测试React功能...');
    
    // 等待React渲染
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 检查React相关元素
    const reactElements = document.querySelectorAll('[data-reactroot], [data-reactid], [class*="react"]');
    console.log(`📊 React相关元素: ${reactElements.length} 个`);
    
    // 检查是否有React错误
    const errorElements = document.querySelectorAll('[class*="error"], [id*="error"]');
    console.log(`📊 错误元素: ${errorElements.length} 个`);
    
    if (errorElements.length > 0) {
      console.log('⚠️ 发现错误元素:');
      errorElements.forEach((el, index) => {
        console.log(`  ${index + 1}. ${el.tagName} - ${el.className || el.id}`);
      });
    }
  }

  private async testMoleculeFunctionality() {
    console.log('\n🔍 测试Molecule功能...');
    
    // 等待Molecule初始化
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 检查Molecule对象
    const molecule = (window as any).molecule;
    const hasMolecule = !!molecule;
    
    console.log(`📊 Molecule对象存在: ${hasMolecule}`);
    
    if (hasMolecule) {
      // 测试Molecule API
      const apis = ['activityBar', 'statusBar', 'sidebar', 'editor', 'notification'];
      let workingApis = 0;
      
      for (const api of apis) {
        try {
          const hasApi = !!molecule[api];
          if (hasApi) {
            workingApis++;
            console.log(`✅ ${api} API: 可用`);
          } else {
            console.log(`❌ ${api} API: 不可用`);
          }
        } catch (error) {
          console.log(`❌ ${api} API: 错误 - ${error}`);
        }
      }
      
      console.log(`📊 可用API数量: ${workingApis}/${apis.length}`);
      
      if (workingApis === 0) {
        console.log('❌ 所有Molecule API都不可用 - 这可能是页面空白的原因');
      }
    } else {
      console.log('❌ Molecule对象不存在 - 这可能是页面空白的主要原因');
    }
  }

  private generateReport() {
    console.log('\n📊 基本功能测试报告');
    console.log('='.repeat(40));
    
    const root = document.getElementById('root');
    const molecule = (window as any).molecule;
    
    if (!root || root.innerHTML.length === 0) {
      console.log('❌ 页面空白问题确认');
      console.log('🔍 可能的原因:');
      console.log('1. React组件渲染失败');
      console.log('2. Molecule框架未加载');
      console.log('3. JavaScript错误阻止了渲染');
      console.log('4. 网络请求失败');
      
      console.log('\n🔧 建议的解决步骤:');
      console.log('1. 检查浏览器控制台错误');
      console.log('2. 重启开发服务器');
      console.log('3. 清除浏览器缓存');
      console.log('4. 检查网络连接');
      
      console.log('\n📝 调试命令:');
      console.log('// 检查页面状态');
      console.log('console.log(document.readyState);');
      console.log('console.log(document.getElementById("root"));');
      console.log('// 检查Molecule');
      console.log('console.log(window.molecule);');
      console.log('// 检查错误');
      console.log('window.onerror = console.error;');
    } else if (!molecule) {
      console.log('⚠️ 页面有内容但Molecule未加载');
      console.log('这可能是因为Molecule框架初始化失败');
    } else {
      console.log('✅ 基本功能正常');
      console.log('页面应该可以正常工作');
    }
  }
}

// 自动运行测试
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const test = new BasicFunctionalityTest();
      test.testBasicFunctionality();
    }, 1000);
  });
}

// 手动运行测试
(window as any).testBasicFunctionality = () => {
  const test = new BasicFunctionalityTest();
  test.testBasicFunctionality();
};
