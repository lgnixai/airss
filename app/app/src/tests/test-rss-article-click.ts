import puppeteer from 'puppeteer';

async function testRssArticleClick() {
  console.log('🔍 开始测试 RSS 文章点击功能...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // 监听控制台日志
    page.on('console', msg => {
      console.log('浏览器控制台:', msg.text());
    });

    // 监听页面错误
    page.on('pageerror', error => {
      console.log('页面错误:', error.message);
      console.log('错误堆栈:', error.stack);
    });

    // 导航到应用
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    console.log('✅ 页面加载完成');

    // 等待主元素加载
    await page.waitForSelector('main', { timeout: 30000 });
    console.log('✅ Main 元素已加载');

    // 等待插件系统初始化
    await page.waitForFunction(() => {
      const logs = (window as any).testLogger?.getLogs() || [];
      return logs.some((log: string) => log.includes('Plugin system initialized successfully'));
    }, { timeout: 15000 });
    console.log('✅ 插件系统已初始化');

    // 等待RSS图标出现
    await page.waitForSelector('.codicon-rss', { timeout: 10000 });
    console.log('✅ 找到 RSS 图标');

    // 点击RSS图标
    await page.click('.codicon-rss');
    console.log('✅ 点击了 RSS 图标');

    // 等待RSS侧边栏内容加载
    await page.waitForFunction(() => {
      const sidebar = document.querySelector('.mo-sidebar__content');
      return sidebar && sidebar.textContent && sidebar.textContent.includes('TechCrunch');
    }, { timeout: 10000 });
    console.log('✅ RSS 侧边栏内容已加载');

    // 点击第一个RSS源（TechCrunch）
    await page.waitForSelector('.mo-sidebar__content', { timeout: 10000 });
    const sidebarContent = await page.$('.mo-sidebar__content');
    if (sidebarContent) {
      const textContent = await sidebarContent.evaluate(el => el.textContent);
      console.log('📋 侧边栏内容:', textContent);
      
      // 查找包含"TechCrunch"的元素并点击
      const techCrunchElement = await page.evaluateHandle(() => {
        const elements = document.querySelectorAll('.mo-sidebar__content div');
        for (const el of elements) {
          if (el.textContent && el.textContent.includes('TechCrunch')) {
            return el;
          }
        }
        return null;
      });
      
      if (techCrunchElement && !(await techCrunchElement.evaluate(el => el === null))) {
        await (techCrunchElement as any).click();
        console.log('✅ 点击了 TechCrunch 源');
        
        // 等待文章列表加载
        await page.waitForFunction(() => {
          const sidebar = document.querySelector('.mo-sidebar__content');
          return sidebar && sidebar.textContent && sidebar.textContent.includes('AI 技术突破');
        }, { timeout: 10000 });
        console.log('✅ 文章列表已加载');
        
        // 点击第一篇文章
        const firstArticle = await page.evaluateHandle(() => {
          const elements = document.querySelectorAll('.mo-sidebar__content div');
          for (const el of elements) {
            if (el.textContent && el.textContent.includes('AI 技术突破')) {
              return el;
            }
          }
          return null;
        });
        
        if (firstArticle && !(await firstArticle.evaluate(el => el === null))) {
          await (firstArticle as any).click();
          console.log('✅ 点击了第一篇文章');
          
          // 等待编辑器打开文章
          await page.waitForFunction(() => {
            const editor = document.querySelector('.monaco-editor');
            return editor && editor.textContent && editor.textContent.includes('AI 技术突破');
          }, { timeout: 10000 });
          console.log('✅ 文章已在编辑器中打开');
          
          // 检查编辑器内容
          const editorContent = await page.evaluate(() => {
            const editor = document.querySelector('.monaco-editor');
            return editor ? editor.textContent : null;
          });
          
          if (editorContent && editorContent.includes('AI 技术突破')) {
            console.log('✅ 编辑器内容正确显示');
            console.log('📋 编辑器内容预览:', editorContent.substring(0, 100) + '...');
          } else {
            console.log('❌ 编辑器内容未正确显示');
          }
        } else {
          console.log('❌ 未找到第一篇文章');
        }
      } else {
        console.log('❌ 未找到 TechCrunch 源');
      }
    } else {
      console.log('❌ 未找到侧边栏内容');
    }

    // 等待一段时间以便观察结果
    await new Promise(resolve => setTimeout(resolve, 3000));

  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await browser.close();
    console.log('🔒 浏览器已关闭');
  }
}

testRssArticleClick().catch(console.error);
