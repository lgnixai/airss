/**
 * Puppeteer 插件加载自动化测试
 * 用于检测插件加载导致页面空白的问题
 */

import puppeteer from 'puppeteer';

export class PuppeteerPluginTest {
  private browser: puppeteer.Browser | null = null;
  private page: puppeteer.Page | null = null;

  async runPluginTest() {
    console.log('🤖 开始Puppeteer插件加载测试...');
    console.log('='.repeat(50));
    
    try {
      // 启动浏览器
      await this.launchBrowser();
      
      // 创建页面
      await this.createPage();
      
      // 设置错误监听
      await this.setupErrorListeners();
      
      // 导航到应用
      await this.navigateToApp();
      
      // 等待页面加载
      await this.waitForPageLoad();
      
      // 检查页面状态
      await this.checkPageState();
      
      // 检查插件系统
      await this.checkPluginSystem();
      
      // 检查Molecule框架
      await this.checkMoleculeFramework();
      
      // 检查Hello插件
      await this.checkHelloPlugin();
      
      // 生成测试报告
      await this.generateTestReport();
      
    } catch (error) {
      console.error('❌ 测试过程中出现错误:', error);
    } finally {
      // 清理资源
      await this.cleanup();
    }
  }

  private async launchBrowser() {
    console.log('🚀 启动浏览器...');
    
    this.browser = await puppeteer.launch({
      headless: false, // 显示浏览器窗口以便观察
      devtools: true,  // 打开开发者工具
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    console.log('✅ 浏览器启动成功');
  }

  private async createPage() {
    console.log('📄 创建页面...');
    
    if (!this.browser) {
      throw new Error('浏览器未启动');
    }
    
    this.page = await this.browser.newPage();
    
    // 设置视口大小
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // 设置用户代理
    await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('✅ 页面创建成功');
  }

  private async setupErrorListeners() {
    console.log('👂 设置错误监听...');
    
    if (!this.page) {
      throw new Error('页面未创建');
    }
    
    // 监听页面错误
    this.page.on('error', (error) => {
      console.error('❌ 页面错误:', error.message);
    });
    
    // 监听页面崩溃
    this.page.on('crash', () => {
      console.error('❌ 页面崩溃');
    });
    
    // 监听控制台消息
    this.page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        console.error(`❌ 控制台错误: ${text}`);
      } else if (type === 'warning') {
        console.warn(`⚠️ 控制台警告: ${text}`);
      } else {
        console.log(`📝 控制台消息 [${type}]: ${text}`);
      }
    });
    
    // 监听请求失败
    this.page.on('requestfailed', (request) => {
      console.error(`❌ 请求失败: ${request.url()} - ${request.failure()?.errorText}`);
    });
    
    console.log('✅ 错误监听设置完成');
  }

  private async navigateToApp() {
    console.log('🌐 导航到应用...');
    
    if (!this.page) {
      throw new Error('页面未创建');
    }
    
    try {
      await this.page.goto('http://localhost:5173/', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      console.log('✅ 成功导航到应用');
    } catch (error) {
      console.error('❌ 导航失败:', error);
      throw error;
    }
  }

  private async waitForPageLoad() {
    console.log('⏳ 等待页面加载...');
    
    if (!this.page) {
      throw new Error('页面未创建');
    }
    
    // 等待页面完全加载
    await this.page.waitForFunction(() => document.readyState === 'complete', {
      timeout: 10000
    });
    
    // 额外等待一段时间让插件系统初始化
    await this.page.waitForTimeout(5000);
    
    console.log('✅ 页面加载完成');
  }

  private async checkPageState() {
    console.log('\n🔍 检查页面状态...');
    
    if (!this.page) {
      throw new Error('页面未创建');
    }
    
    // 检查页面标题
    const title = await this.page.title();
    console.log(`📊 页面标题: ${title}`);
    
    // 检查页面URL
    const url = this.page.url();
    console.log(`📊 页面URL: ${url}`);
    
    // 检查根元素
    const rootExists = await this.page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        exists: !!root,
        hasContent: root ? root.innerHTML.length > 0 : false,
        childrenCount: root ? root.children.length : 0
      };
    });
    
    console.log(`📊 Root元素存在: ${rootExists.exists}`);
    console.log(`📊 Root有内容: ${rootExists.hasContent}`);
    console.log(`📊 Root子元素数量: ${rootExists.childrenCount}`);
    
    if (!rootExists.exists) {
      console.log('❌ Root元素不存在 - 页面结构有问题');
    } else if (!rootExists.hasContent) {
      console.log('❌ Root元素为空 - 这可能是页面空白的原因');
    }
    
    // 检查页面是否空白
    const isPageBlank = await this.page.evaluate(() => {
      const body = document.body;
      const visibleElements = body.querySelectorAll('*:not(script):not(style):not(link)');
      return visibleElements.length <= 1; // 只有body元素
    });
    
    console.log(`📊 页面是否空白: ${isPageBlank}`);
    
    if (isPageBlank) {
      console.log('❌ 页面确实空白 - 需要进一步诊断');
    }
  }

  private async checkPluginSystem() {
    console.log('\n🔍 检查插件系统...');
    
    if (!this.page) {
      throw new Error('页面未创建');
    }
    
    // 检查控制台日志中的插件相关信息
    const pluginLogs = await this.page.evaluate(() => {
      // 这里我们无法直接获取控制台日志，但可以检查一些关键元素
      const allElements = Array.from(document.querySelectorAll('*'));
      const pluginElements = allElements.filter(el => 
        el.textContent?.includes('Plugin') || 
        el.textContent?.includes('plugin') ||
        el.className?.includes('plugin') ||
        el.id?.includes('plugin')
      );
      
      return {
        pluginElementsCount: pluginElements.length,
        pluginTexts: pluginElements.map(el => el.textContent?.substring(0, 50))
      };
    });
    
    console.log(`📊 插件相关元素: ${pluginLogs.pluginElementsCount} 个`);
    
    if (pluginLogs.pluginTexts.length > 0) {
      console.log('📝 插件相关文本:');
      pluginLogs.pluginTexts.forEach((text, index) => {
        console.log(`  ${index + 1}. ${text}`);
      });
    }
  }

  private async checkMoleculeFramework() {
    console.log('\n🔍 检查Molecule框架...');
    
    if (!this.page) {
      throw new Error('页面未创建');
    }
    
    // 检查Molecule对象
    const moleculeState = await this.page.evaluate(() => {
      const molecule = (window as any).molecule;
      if (!molecule) {
        return { exists: false, apis: {} };
      }
      
      const apis = ['activityBar', 'statusBar', 'sidebar', 'editor', 'notification'];
      const apiState: Record<string, boolean> = {};
      
      for (const api of apis) {
        try {
          apiState[api] = !!molecule[api];
        } catch (error) {
          apiState[api] = false;
        }
      }
      
      return { exists: true, apis: apiState };
    });
    
    console.log(`📊 Molecule对象存在: ${moleculeState.exists}`);
    
    if (moleculeState.exists) {
      console.log('📊 Molecule API状态:');
      Object.entries(moleculeState.apis).forEach(([api, available]) => {
        console.log(`  - ${api}: ${available ? '✅' : '❌'}`);
      });
    } else {
      console.log('❌ Molecule对象不存在 - 这可能是页面空白的主要原因');
    }
  }

  private async checkHelloPlugin() {
    console.log('\n🔍 检查Hello插件...');
    
    if (!this.page) {
      throw new Error('页面未创建');
    }
    
    // 检查Hello插件元素
    const helloState = await this.page.evaluate(() => {
      const allElements = Array.from(document.querySelectorAll('*'));
      
      // 查找包含 👋 的元素
      const helloElements = allElements.filter(el => 
        el.textContent?.includes('👋') || el.innerHTML?.includes('👋')
      );
      
      // 查找Hello Plugin文本
      const helloTextElements = allElements.filter(el => 
        el.textContent?.includes('Hello Plugin')
      );
      
      // 查找活动栏
      const activityBarElements = allElements.filter(el => 
        el.className?.includes('activity') || 
        el.className?.includes('Activity') ||
        el.className?.includes('activityBar')
      );
      
      return {
        helloElementsCount: helloElements.length,
        helloTextElementsCount: helloTextElements.length,
        activityBarElementsCount: activityBarElements.length,
        helloTexts: helloElements.map(el => el.textContent?.substring(0, 30))
      };
    });
    
    console.log(`📊 Hello元素数量: ${helloState.helloElementsCount}`);
    console.log(`📊 Hello文本元素数量: ${helloState.helloTextElementsCount}`);
    console.log(`📊 活动栏元素数量: ${helloState.activityBarElementsCount}`);
    
    if (helloState.helloTexts.length > 0) {
      console.log('📝 Hello相关文本:');
      helloState.helloTexts.forEach((text, index) => {
        console.log(`  ${index + 1}. ${text}`);
      });
    }
  }

  private async generateTestReport() {
    console.log('\n📊 Puppeteer插件测试报告');
    console.log('='.repeat(50));
    
    // 获取最终页面状态
    if (!this.page) {
      console.log('❌ 页面未创建，无法生成报告');
      return;
    }
    
    const finalState = await this.page.evaluate(() => {
      const root = document.getElementById('root');
      const molecule = (window as any).molecule;
      const body = document.body;
      
      return {
        rootExists: !!root,
        rootHasContent: root ? root.innerHTML.length > 0 : false,
        moleculeExists: !!molecule,
        bodyChildrenCount: body.children.length,
        pageTitle: document.title,
        readyState: document.readyState
      };
    });
    
    console.log('📊 最终页面状态:');
    console.log(`  - 页面标题: ${finalState.pageTitle}`);
    console.log(`  - 加载状态: ${finalState.readyState}`);
    console.log(`  - Root元素存在: ${finalState.rootExists}`);
    console.log(`  - Root有内容: ${finalState.rootHasContent}`);
    console.log(`  - Molecule存在: ${finalState.moleculeExists}`);
    console.log(`  - Body子元素: ${finalState.bodyChildrenCount}`);
    
    // 分析问题
    if (!finalState.rootExists) {
      console.log('\n❌ 问题诊断: Root元素不存在');
      console.log('🔧 建议: 检查HTML结构和React渲染');
    } else if (!finalState.rootHasContent) {
      console.log('\n❌ 问题诊断: Root元素为空');
      console.log('🔧 建议: 检查React组件渲染和JavaScript错误');
    } else if (!finalState.moleculeExists) {
      console.log('\n❌ 问题诊断: Molecule框架未加载');
      console.log('🔧 建议: 检查Molecule依赖和初始化');
    } else {
      console.log('\n✅ 页面状态正常');
    }
    
    console.log('\n🎯 如果问题持续存在，请:');
    console.log('1. 检查浏览器控制台错误');
    console.log('2. 查看网络请求状态');
    console.log('3. 确认所有依赖都已正确安装');
    console.log('4. 尝试清除缓存并重新启动');
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

// 运行测试的函数
export async function runPuppeteerPluginTest() {
  const test = new PuppeteerPluginTest();
  await test.runPluginTest();
}

// 如果直接运行此文件
if (require.main === module) {
  runPuppeteerPluginTest().catch(console.error);
}
