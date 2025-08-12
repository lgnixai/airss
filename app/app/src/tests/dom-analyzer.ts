import puppeteer from 'puppeteer';

async function analyzeDOM() {
  let browser: any = null;
  
  try {
    console.log('🔍 开始 DOM 分析...');
    
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 }
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:5174');
    console.log('✅ 页面加载完成');
    
    // 等待页面完全加载
    await page.waitForSelector('main', { timeout: 30000 });
    console.log('✅ Main 元素已加载');
    
    // 额外等待确保 React 组件渲染完成
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const domInfo = await page.evaluate(() => {
      const info: any = {
        title: document.title,
        bodyClasses: document.body.className,
        mainElement: null,
        allElements: []
      };
      
      const main = document.querySelector('main');
      if (main) {
        info.mainElement = {
          className: main.className,
          id: main.id,
          children: Array.from(main.children).map(child => ({
            tagName: child.tagName,
            className: child.className,
            id: child.id
          }))
        };
      }
      
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.className && typeof el.className === 'string') {
          const classes = el.className.split(' ');
          classes.forEach(cls => {
            if (cls.toLowerCase().includes('activity') || 
                cls.toLowerCase().includes('auxiliary') || 
                cls.toLowerCase().includes('sidebar') ||
                cls.toLowerCase().includes('editor') ||
                cls.toLowerCase().includes('workbench')) {
              info.allElements.push({
                tagName: el.tagName,
                className: el.className,
                id: el.id,
                textContent: el.textContent?.substring(0, 50)
              });
            }
          });
        }
      });
      
      return info;
    });
    
    console.log('📄 页面标题:', domInfo.title);
    console.log('🏷️ Body 类名:', domInfo.bodyClasses);
    
    if (domInfo.mainElement) {
      console.log('🎯 Main 元素:');
      console.log('  类名:', domInfo.mainElement.className);
      console.log('  ID:', domInfo.mainElement.id);
      console.log('  子元素数量:', domInfo.mainElement.children.length);
      domInfo.mainElement.children.forEach((child: any, index: number) => {
        console.log(`    ${index + 1}. ${child.tagName} - ${child.className} (${child.id})`);
      });
    }
    
    console.log('🔍 相关元素:');
    domInfo.allElements.forEach((el: any, index: number) => {
      console.log(`  ${index + 1}. ${el.tagName} - ${el.className} (${el.id})`);
      if (el.textContent) {
        console.log(`     文本: ${el.textContent}`);
      }
    });
    
  } catch (error) {
    console.error('❌ 分析失败:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 浏览器已关闭');
    }
  }
}

analyzeDOM();
