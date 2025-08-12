import puppeteer from 'puppeteer';

async function debugLogs() {
  let browser: any = null;
  
  try {
    console.log('🔍 开始调试日志分析...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();
    
    // 监听控制台日志
    page.on('console', (msg) => {
      console.log('浏览器控制台:', msg.text());
    });
    
    await page.goto('http://localhost:5174');
    console.log('✅ 页面加载完成');
    
    // 等待页面完全加载
    await page.waitForSelector('main', { timeout: 30000 });
    console.log('✅ Main 元素已加载');
    
    // 等待插件系统初始化
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // 获取所有日志
    const logs = await page.evaluate(() => {
      return (window as any).testLogs ? (window as any).testLogs() : [];
    });
    
    console.log('📋 收集到的日志:');
    logs.forEach((log: string, index: number) => {
      if (log.includes('RSS') || log.includes('Plugin') || log.includes('Activity')) {
        console.log(`${index + 1}. ${log}`);
      }
    });
    
    // 检查 ActivityBar 中的图标
    const activityBarItems = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.mo-activityBar__item'));
      return items.map(item => {
        const icon = item.querySelector('.codicon');
        return {
          className: item.className,
          iconClass: icon ? icon.className : 'no-icon',
          text: item.textContent || ''
        };
      });
    });
    
    console.log('🎯 ActivityBar 项目:');
    activityBarItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.iconClass} - ${item.text}`);
    });
    
  } catch (error) {
    console.error('❌ 调试失败:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 浏览器已关闭');
    }
  }
}

debugLogs();
