import puppeteer, { Browser, Page } from 'puppeteer';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
  duration: number;
}

class AiAssistantTester {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private results: TestResult[] = [];

  async initialize() {
    console.log('🤖 AI助手组件测试工具');
    console.log('='.repeat(40));
    
    // 启动浏览器
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();
    this.page.setDefaultTimeout(30000);
    
    console.log('✅ 浏览器启动成功');
  }

  async runTests() {
    if (!this.page) throw new Error('页面未初始化');

    console.log('📋 开始AI助手组件测试...');

    const tests = [
      { name: '页面加载测试', fn: () => this.testPageLoad() },
      { name: 'AI助手组件渲染测试', fn: () => this.testAiComponentRender() },
      { name: '滚动功能测试', fn: () => this.testScrollFunctionality() },
      { name: '发送按钮测试', fn: () => this.testSendButton() },
      { name: 'AI操作按钮测试', fn: () => this.testAiActionButtons() },
      { name: '聊天功能测试', fn: () => this.testChatFunctionality() }
    ];

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

    await this.page.goto('http://localhost:5174');
    await this.page.waitForSelector('body', { timeout: 10000 });
    
    // 等待应用完全加载
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  private async testAiComponentRender() {
    if (!this.page) throw new Error('页面未初始化');

    // 等待AI助手组件加载
    await this.page.waitForSelector('.ai-chat-component', { timeout: 15000 });
    
    // 检查组件是否正确渲染
    const componentExists = await this.page.evaluate(() => {
      const component = document.querySelector('.ai-chat-component');
      return component !== null;
    });
    
    if (!componentExists) {
      throw new Error('AI助手组件未正确渲染');
    }

    // 检查欢迎消息
    const hasWelcomeMessage = await this.page.evaluate(() => {
      const component = document.querySelector('.ai-chat-component');
      return component && component.textContent && component.textContent.includes('你好！我是你的AI助手');
    });
    
    if (!hasWelcomeMessage) {
      throw new Error('AI助手欢迎消息未显示');
    }
  }

  private async testScrollFunctionality() {
    if (!this.page) throw new Error('页面未初始化');

    // 等待一下让CSS生效
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 检查AuxiliaryBar content区域是否有滚动功能
    const hasScrollContainer = await this.page.evaluate(() => {
      const content = document.querySelector('.mo-auxiliaryBar__content');
      if (!content) return false;
      
      const computedStyle = window.getComputedStyle(content);
      console.log('AuxiliaryBar content overflow-y:', computedStyle.overflowY);
      return computedStyle.overflowY === 'auto' || computedStyle.overflowY === 'scroll';
    });
    
    if (!hasScrollContainer) {
      throw new Error('AuxiliaryBar content区域缺少滚动功能');
    }

    // 检查AI助手组件内部是否有滚动
    const hasAiScroll = await this.page.evaluate(() => {
      const component = document.querySelector('.ai-chat-component');
      if (!component) return false;
      
      // 检查消息容器是否有滚动
      const messageContainer = component.querySelector('div[style*="overflow-y"]');
      return messageContainer !== null;
    });
    
    if (!hasAiScroll) {
      throw new Error('AI助手消息列表缺少滚动功能');
    }
  }

  private async testSendButton() {
    if (!this.page) throw new Error('页面未初始化');

    // 查找发送按钮 - 使用更简单的选择器
    const sendButton = await this.page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent && btn.textContent.includes('发送'));
    });
    
    if (!sendButton) {
      throw new Error('发送按钮未找到');
    }

    // 检查发送按钮是否可见
    const isVisible = await this.page.evaluate((button) => {
      const rect = button.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }, sendButton);
    
    if (!isVisible) {
      throw new Error('发送按钮不可见');
    }

    // 检查发送按钮是否可点击
    const isClickable = await this.page.evaluate((button) => {
      const style = window.getComputedStyle(button);
      return style.pointerEvents !== 'none' && style.opacity !== '0';
    }, sendButton);
    
    if (!isClickable) {
      throw new Error('发送按钮不可点击');
    }
  }

  private async testAiActionButtons() {
    if (!this.page) throw new Error('页面未初始化');

    // 检查AI操作按钮
    const buttonTexts = await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.ai-chat-component button'));
      return buttons.map(btn => btn.textContent || '').filter(text => 
        text.includes('总结文章') || 
        text.includes('翻译内容') || 
        text.includes('解释概念') ||
        text.includes('代码审查') ||
        text.includes('优化建议') ||
        text.includes('自由对话')
      );
    });
    
    if (buttonTexts.length < 6) {
      throw new Error(`AI操作按钮不完整，找到: ${buttonTexts.join(', ')}`);
    }

    // 检查按钮是否可点击
    const clickableButtons = await this.page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.ai-chat-component button'));
      return buttons.filter(btn => {
        const style = window.getComputedStyle(btn);
        return style.pointerEvents !== 'none' && style.opacity !== '0';
      }).length;
    });
    
    if (clickableButtons < 6) {
      throw new Error(`可点击的AI操作按钮数量不足: ${clickableButtons}`);
    }
  }

  private async testChatFunctionality() {
    if (!this.page) throw new Error('页面未初始化');

    // 查找输入框
    const input = await this.page.$('input[placeholder*="输入问题"]');
    if (!input) {
      throw new Error('聊天输入框未找到');
    }

    // 测试输入功能
    await input.type('测试消息');
    
    const inputValue = await this.page.evaluate((el) => (el as HTMLInputElement).value, input);
    if (inputValue !== '测试消息') {
      throw new Error('输入框输入功能异常');
    }

    // 清空输入框
    await input.click({ clickCount: 3 });
    await input.press('Backspace');
  }

  private generateReport() {
    console.log('\n📊 AI助手组件测试报告');
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
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 浏览器已关闭');
    }
  }
}

async function runAiAssistantTests() {
  const tester = new AiAssistantTester();
  
  try {
    await tester.initialize();
    await tester.runTests();
    tester.generateReport();
  } finally {
    await tester.cleanup();
  }
}

export { runAiAssistantTests };
