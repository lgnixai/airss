import puppeteer from 'puppeteer';

async function testRssClick() {
  let browser: any = null;
  
  try {
    console.log('🔍 开始测试 RSS 点击功能...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();
    
    // 监听控制台日志
    page.on('console', (msg) => {
      console.log('浏览器控制台:', msg.text());
    });
    
    // 监听页面错误
    page.on('pageerror', (error) => {
      console.log('页面错误:', error.message);
      console.log('错误堆栈:', error.stack);
    });
    
    // 监听未处理的 Promise 拒绝
    page.on('unhandledrejection', (reason) => {
      console.log('未处理的 Promise 拒绝:', reason);
    });
    
    await page.goto('http://localhost:5173');
    console.log('✅ 页面加载完成');
    
    // 等待页面完全加载
    await page.waitForSelector('main', { timeout: 30000 });
    console.log('✅ Main 元素已加载');
    
    // 等待插件系统初始化
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // 查找 RSS 图标
    const rssIcon = await page.$('.codicon-rss');
    if (!rssIcon) {
      throw new Error('找不到 RSS 图标');
    }
    
    console.log('✅ 找到 RSS 图标');
    
    // 点击 RSS 图标
    await rssIcon.click();
    console.log('✅ 点击了 RSS 图标');
    
    // 等待 RSS 内容出现
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 检查是否有 RSS 内容
    const rssContent = await page.evaluate(() => {
      const sidebar = document.querySelector('.mo-sidebar__content');
      if (!sidebar) return null;
      
      return {
        hasRssTitle: sidebar.textContent?.includes('RSS 订阅源'),
        hasFeeds: sidebar.textContent?.includes('TechCrunch') || 
                 sidebar.textContent?.includes('Hacker News') ||
                 sidebar.textContent?.includes('GitHub Trending'),
        textContent: sidebar.textContent?.substring(0, 200)
      };
    });
    
    console.log('📋 RSS 内容检查结果:', rssContent);
    
    if (rssContent && rssContent.hasRssTitle) {
      console.log('✅ RSS 内容已正确显示');
    } else {
      console.log('❌ RSS 内容未正确显示');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 浏览器已关闭');
    }
  }
}

testRssClick();
