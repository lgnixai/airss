/**
 * 插件加载测试
 * 专门检测插件加载导致页面空白的问题
 */

import puppeteer from 'puppeteer';

export class PluginLoadingTest {
  private browser: puppeteer.Browser | null = null;
  private page: puppeteer.Page | null = null;

  async testPluginLoading() {
    console.log('🔍 开始插件加载测试...');
    console.log('='.repeat(40));
    
    try {
      // 启动浏览器
      await this.launchBrowser();
      
      // 创建页面
      await this.createPage();
      
      // 设置监听器
      await this.setupListeners();
      
      // 测试页面加载
      await this.testPageLoading();
      
      // 测试插件系统
      await this.testPluginSystem();
      
      // 生成报告
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ 测试失败:', error);
    } finally {
      await this.cleanup();
    }
  }

  private async launchBrowser() {
    console.log('🚀 启动浏览器...');
    
    this.browser = await puppeteer.launch({
      headless: false,
      devtools: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('✅ 浏览器启动成功');
  }

  private async createPage() {
    if (!this.browser) throw new Error('浏览器未启动');
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 720 });
    
    console.log('✅ 页面创建成功');
  }

  private async setupListeners() {
    if (!this.page) throw new Error('页面未创建');
    
    // 监听控制台错误
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`❌ 控制台错误: ${msg.text()}`);
      }
    });
    
    // 监听页面错误
    this.page.on('error', (error) => {
      console.error(`❌ 页面错误: ${error.message}`);
    });
    
    // 监听请求失败
    this.page.on('requestfailed', (request) => {
      console.error(`❌ 请求失败: ${request.url()}`);
    });
    
    console.log('✅ 监听器设置完成');
  }

  private async testPageLoading() {
    console.log('\n🔍 测试页面加载...');
    
    if (!this.page) throw new Error('页面未创建');
    
    try {
      // 导航到应用
      await this.page.goto('http://localhost:5173/', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      console.log('✅ 页面导航成功');
      
      // 等待页面加载
      await this.page.waitForFunction(() => document.readyState === 'complete', {
        timeout: 10000
      });
      
      console.log('✅ 页面加载完成');
      
      // 等待插件系统初始化
      await this.page.waitForTimeout(3000);
      
      // 检查页面状态
      const pageState = await this.page.evaluate(() => {
        const root = document.getElementById('root');
        const molecule = (window as any).molecule;
        
        return {
          title: document.title,
          readyState: document.readyState,
          rootExists: !!root,
          rootHasContent: root ? root.innerHTML.length > 0 : false,
          moleculeExists: !!molecule,
          bodyChildren: document.body.children.length
        };
      });
      
      console.log('📊 页面状态:');
      console.log(`  - 标题: ${pageState.title}`);
      console.log(`  - 加载状态: ${pageState.readyState}`);
      console.log(`  - Root存在: ${pageState.rootExists}`);
      console.log(`  - Root有内容: ${pageState.rootHasContent}`);
      console.log(`  - Molecule存在: ${pageState.moleculeExists}`);
      console.log(`  - Body子元素: ${pageState.bodyChildren}`);
      
      if (!pageState.rootHasContent) {
        console.log('❌ 页面空白问题确认');
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error('❌ 页面加载失败:', error);
      return false;
    }
  }

  private async testPluginSystem() {
    console.log('\n🔍 测试插件系统...');
    
    if (!this.page) throw new Error('页面未创建');
    
    // 检查插件系统状态
    const pluginState = await this.page.evaluate(() => {
      const molecule = (window as any).molecule;
      
      if (!molecule) {
        return { moleculeExists: false, pluginSystemExists: false };
      }
      
      // 检查插件系统相关对象
      const pluginSystem = (window as any).pluginSystem;
      
      // 检查是否有插件相关的DOM元素
      const allElements = Array.from(document.querySelectorAll('*'));
      const pluginElements = allElements.filter(el => 
        el.textContent?.includes('Plugin') || 
        el.textContent?.includes('plugin') ||
        el.className?.includes('plugin') ||
        el.id?.includes('plugin')
      );
      
      // 检查Hello插件元素
      const helloElements = allElements.filter(el => 
        el.textContent?.includes('👋') || el.innerHTML?.includes('👋')
      );
      
      return {
        moleculeExists: true,
        pluginSystemExists: !!pluginSystem,
        pluginElementsCount: pluginElements.length,
        helloElementsCount: helloElements.length,
        pluginTexts: pluginElements.map(el => el.textContent?.substring(0, 30))
      };
    });
    
    console.log('📊 插件系统状态:');
    console.log(`  - Molecule存在: ${pluginState.moleculeExists}`);
    console.log(`  - 插件系统存在: ${pluginState.pluginSystemExists}`);
    console.log(`  - 插件元素数量: ${pluginState.pluginElementsCount}`);
    console.log(`  - Hello元素数量: ${pluginState.helloElementsCount}`);
    
    if (pluginState.pluginTexts.length > 0) {
      console.log('📝 插件相关文本:');
      pluginState.pluginTexts.forEach((text, index) => {
        console.log(`  ${index + 1}. ${text}`);
      });
    }
    
    return pluginState;
  }

  private async generateReport() {
    console.log('\n📊 插件加载测试报告');
    console.log('='.repeat(40));
    
    if (!this.page) {
      console.log('❌ 页面未创建，无法生成报告');
      return;
    }
    
    // 获取最终状态
    const finalState = await this.page.evaluate(() => {
      const root = document.getElementById('root');
      const molecule = (window as any).molecule;
      
      return {
        rootExists: !!root,
        rootHasContent: root ? root.innerHTML.length > 0 : false,
        moleculeExists: !!molecule,
        pageTitle: document.title,
        readyState: document.readyState
      };
    });
    
    console.log('📊 最终状态:');
    console.log(`  - 页面标题: ${finalState.pageTitle}`);
    console.log(`  - 加载状态: ${finalState.readyState}`);
    console.log(`  - Root存在: ${finalState.rootExists}`);
    console.log(`  - Root有内容: ${finalState.rootHasContent}`);
    console.log(`  - Molecule存在: ${finalState.moleculeExists}`);
    
    // 分析问题
    if (!finalState.rootHasContent) {
      console.log('\n❌ 问题诊断: 页面空白');
      console.log('🔍 可能的原因:');
      console.log('1. React组件渲染失败');
      console.log('2. JavaScript错误阻止了渲染');
      console.log('3. 插件系统初始化失败');
      console.log('4. Molecule框架加载失败');
      
      console.log('\n🔧 建议的解决步骤:');
      console.log('1. 检查浏览器控制台错误');
      console.log('2. 查看网络请求状态');
      console.log('3. 暂时禁用插件系统测试');
      console.log('4. 检查Molecule依赖');
    } else if (!finalState.moleculeExists) {
      console.log('\n⚠️ 问题诊断: Molecule框架未加载');
      console.log('🔧 建议: 检查Molecule依赖和初始化');
    } else {
      console.log('\n✅ 页面和插件系统正常');
    }
  }

  private async cleanup() {
    console.log('\n🧹 清理资源...');
    
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    
    console.log('✅ 资源清理完成');
  }
}

// 运行测试
export async function runPluginLoadingTest() {
  const test = new PluginLoadingTest();
  await test.testPluginLoading();
}

// 如果直接运行此文件
if (require.main === module) {
  runPluginLoadingTest().catch(console.error);
}
