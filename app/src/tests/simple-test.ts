import puppeteer, { Browser, Page } from 'puppeteer';

async function simpleTest() {
  let browser: Browser | null = null;
  
  try {
    console.log('🧪 开始简单测试...');
    
    // 启动浏览器
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();
    
    // 导航到应用
    await page.goto('http://localhost:5174');
    console.log('✅ 页面加载完成');
    
    // 等待页面稳定
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 截图保存
    await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
    console.log('📸 截图已保存: test-screenshot.png');
    
    // 获取页面标题
    const title = await page.title();
    console.log('📄 页面标题:', title);
    
    // 检查控制台日志
    const logs = await page.evaluate(() => {
      return (window as any).testLogs || [];
    });
    
    console.log('📝 控制台日志数量:', Array.isArray(logs) ? logs.length : 'undefined');
    if (Array.isArray(logs)) {
      logs.slice(0, 10).forEach((log: string, index: number) => {
        console.log(`  ${index + 1}. ${log}`);
      });
    }
    
    // 检查 DOM 结构
    const activityBar = await page.$('[class*="activity"], [class*="ActivityBar"]');
    console.log('🎯 ActivityBar 存在:', !!activityBar);
    
    const auxiliaryBar = await page.$('[class*="auxiliary"], [class*="AuxiliaryBar"]');
    console.log('🎯 AuxiliaryBar 存在:', !!auxiliaryBar);
    
    const sidebar = await page.$('[class*="sidebar"], [class*="Sidebar"]');
    console.log('🎯 Sidebar 存在:', !!sidebar);
    
    // 获取所有元素的类名
    const allElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const classNames = new Set<string>();
      elements.forEach(el => {
        if (el.className) {
          el.className.split(' ').forEach(cls => {
            if (cls.includes('activity') || cls.includes('auxiliary') || cls.includes('sidebar')) {
              classNames.add(cls);
            }
          });
        }
      });
      return Array.from(classNames);
    });
    
    console.log('🏷️ 相关类名:', allElements);
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 浏览器已关闭');
    }
  }
}

// 运行测试
simpleTest();
