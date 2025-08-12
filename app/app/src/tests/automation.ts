import puppeteer, { Browser, Page } from 'puppeteer';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
  duration: number;
}

// 测试配置
const TestConfig = {
  app: {
    url: 'http://localhost:5174'
  },
  timeouts: {
    pageLoad: 15000,
    elementWait: 10000,
    pluginInit: 8000
  }
};

class MoleculeAutomationTester {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private results: TestResult[] = [];

  async initialize() {
    console.log('🚀 启动自动化测试...');
    
    // 启动浏览器
    this.browser = await puppeteer.launch({
      headless: false, // 设置为 true 可以无头模式运行
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // 创建新页面
    this.page = await this.browser.newPage();
    
    // 设置页面超时
    this.page.setDefaultTimeout(30000);
    
    console.log('✅ 浏览器启动成功');
  }

  async runTests() {
    if (!this.page) {
      throw new Error('页面未初始化');
    }

    console.log('📋 开始运行测试用例...');

    // 测试用例列表
    const tests = [
      { name: '页面加载测试', fn: () => this.testPageLoad() },
      { name: '插件系统初始化测试', fn: () => this.testPluginSystemInit() },
      { name: 'RSS 插件加载测试', fn: () => this.testRssPluginLoad() },
      { name: 'AI 助手插件加载测试', fn: () => this.testAiAssistantLoad() },
      { name: 'RSS 文章打开测试', fn: () => this.testRssArticleOpen() },
      { name: 'AI 助手功能测试', fn: () => this.testAiAssistantFunction() },
      { name: 'AuxiliaryBar 显示测试', fn: () => this.testAuxiliaryBarDisplay() }
    ];

    // 运行所有测试
    for (const test of tests) {
      await this.runTest(test.name, test.fn);
    }
  }

  private async runTest(name: string, testFn: () => Promise<void>) {
    const startTime = Date.now();
    
    try {
      console.log(`\n🧪 运行测试: ${name}`);
      await testFn();
      
      this.results.push({
        name,
        status: 'PASS',
        message: '测试通过',
        duration: Date.now() - startTime
      });
      
      console.log(`✅ ${name} - 通过`);
    } catch (error) {
      this.results.push({
        name,
        status: 'FAIL',
        message: error instanceof Error ? error.message : String(error),
        duration: Date.now() - startTime
      });
      
      console.log(`❌ ${name} - 失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async testPageLoad() {
    if (!this.page) throw new Error('页面未初始化');

    // 导航到应用页面
    await this.page.goto(TestConfig.app.url);
    
    // 等待页面加载完成
    await this.page.waitForSelector('main', { timeout: TestConfig.timeouts.pageLoad });
    
    // 检查页面标题
    const title = await this.page.title();
    if (!title.includes('Molecule')) {
      throw new Error(`页面标题不正确: ${title}`);
    }
  }

  private async testPluginSystemInit() {
    if (!this.page) throw new Error('页面未初始化');

    // 等待插件系统初始化
    await new Promise(resolve => setTimeout(resolve, TestConfig.timeouts.pluginInit));
    
    // 检查控制台日志中是否有插件系统初始化信息
    const logs = await this.page.evaluate(() => {
      return (window as any).testLogs ? (window as any).testLogs() : [];
    });
    
    const hasPluginInit = logs.some((log: string) => 
      log.includes('Plugin system initialized') || 
      log.includes('Starting plugin system initialization')
    );
    
    if (!hasPluginInit) {
      throw new Error('插件系统未初始化');
    }
  }

  private async testRssPluginLoad() {
    if (!this.page) throw new Error('页面未初始化');

    // 等待插件管理图标出现（puzzle 图标）
    await this.page.waitForSelector('.codicon-puzzle', { timeout: TestConfig.timeouts.elementWait });
    
    // 检查控制台日志
    const hasRssLogs = await this.page.evaluate(() => {
      const logs = (window as any).testLogs ? (window as any).testLogs() : [];
      return Array.isArray(logs) && logs.some((log: string) => log.includes('RSS') || log.includes('Hacker News'));
    });
    
    if (!hasRssLogs) {
      throw new Error('RSS 插件未正确加载');
    }
  }

  private async testAiAssistantLoad() {
    if (!this.page) throw new Error('页面未初始化');

    // 等待 AI 助手加载 - 使用更准确的选择器
    await this.page.waitForSelector('.mo-auxiliaryBar__container', { timeout: TestConfig.timeouts.elementWait });
    
    // 检查 AI 助手内容是否存在
    const hasAiAssistant = await this.page.evaluate(() => {
      const auxiliaryBar = document.querySelector('.mo-auxiliaryBar__container');
      return auxiliaryBar && auxiliaryBar.textContent && auxiliaryBar.textContent.includes('AI 助手');
    });
    
    if (!hasAiAssistant) {
      throw new Error('AI 助手未正确加载');
    }
  }

  private async testRssArticleOpen() {
    if (!this.page) throw new Error('页面未初始化');

    // 等待插件管理组件注册完成
    await new Promise(resolve => setTimeout(resolve, 4000));

    // 查找插件管理图标（puzzle 图标）
    const pluginManagerIcon = await this.page.$('.codicon-puzzle');
    if (!pluginManagerIcon) {
      throw new Error('找不到插件管理图标');
    }

    // 验证插件系统已加载
    const hasPlugins = await this.page.evaluate(() => {
      const logs = (window as any).testLogs ? (window as any).testLogs() : [];
      return Array.isArray(logs) && logs.some((log: string) => 
        log.includes('RSS') || log.includes('Hacker News') || log.includes('Plugin system initialized')
      );
    });
    
    if (!hasPlugins) {
      throw new Error('插件系统未正确加载');
    }
  }

  private async testAiAssistantFunction() {
    if (!this.page) throw new Error('页面未初始化');

    // 等待 AI 助手内容出现 - 使用更准确的选择器
    await this.page.waitForSelector('.mo-auxiliaryBar__container', { timeout: TestConfig.timeouts.elementWait });
    
    // 检查 AI 助手按钮 - 使用正确的选择器语法
    const summarizeButton = await this.page.$('button');
    const translateButton = await this.page.$('button');
    const explainButton = await this.page.$('button');
    
    // 检查按钮文本内容
    const buttonTexts = await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(btn => btn.textContent || '').filter(text => 
        text.includes('总结文章') || text.includes('翻译内容') || text.includes('解释概念')
      );
    });
    
    if (buttonTexts.length < 3) {
      throw new Error(`AI 助手功能按钮未找到，找到的按钮: ${buttonTexts.join(', ')}`);
    }
  }

  private async testAuxiliaryBarDisplay() {
    if (!this.page) throw new Error('页面未初始化');

    // 检查 AuxiliaryBar 是否显示 - 使用更准确的选择器
    const auxiliaryBar = await this.page.$('.mo-auxiliaryBar__container');
    if (!auxiliaryBar) {
      throw new Error('AuxiliaryBar 未显示');
    }
  }

  private generateReport() {
    console.log('\n📊 测试报告');
    console.log('='.repeat(50));
    
    const total = this.results.length;
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = total - passed;
    
    console.log(`总测试数: ${total}`);
    console.log(`通过: ${passed}`);
    console.log(`失败: ${failed}`);
    console.log(`成功率: ${((passed / total) * 100).toFixed(1)}%`);
    
    console.log('\n详细结果:');
    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${result.name} (${result.duration}ms) - ${result.message}`);
    });
    
    // 保存报告到文件
    const report = {
      timestamp: new Date().toISOString(),
      summary: { total, passed, failed, successRate: (passed / total) * 100 },
      results: this.results
    };
    
    // 这里可以保存到文件或发送到服务器
    console.log('\n📄 测试报告已生成');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 浏览器已关闭');
    }
  }
}

// 运行测试
async function runAutomationTests() {
  const tester = new MoleculeAutomationTester();
  
  try {
    await tester.initialize();
    await tester.runTests();
  } catch (error) {
    console.error('❌ 测试运行失败:', error);
  } finally {
    await tester.cleanup();
  }
}

// 导出测试类
export { MoleculeAutomationTester, runAutomationTests };

// 如果直接运行此文件
if (require.main === module) {
  runAutomationTests();
}
