import puppeteer from 'puppeteer';

async function testSimpleEditor() {
  console.log('🔍 开始简单编辑器测试...');
  
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
        
        // 等待一段时间让编辑器加载
        await page.waitForTimeout(3000);
        
        // 检查是否有编辑器标签页
        const hasTabs = await page.evaluate(() => {
          const tabs = document.querySelectorAll('[data-testid="tab"], .mo-editor__tab');
          console.log('找到标签页数量:', tabs.length);
          return tabs.length > 0;
        });
        
        if (hasTabs) {
          console.log('✅ 编辑器标签页已创建');
          
          // 检查编辑器内容
          const editorContent = await page.evaluate(() => {
            // 查找Monaco编辑器
            const monacoEditor = document.querySelector('.monaco-editor');
            if (monacoEditor) {
              console.log('找到Monaco编辑器');
              
              // 尝试获取编辑器内容
              const textArea = monacoEditor.querySelector('textarea');
              if (textArea && textArea.value) {
                console.log('找到textarea内容:', textArea.value.substring(0, 100));
                return textArea.value;
              }
              
              // 尝试其他方式获取内容
              const contentDiv = monacoEditor.querySelector('.monaco-editor-background');
              if (contentDiv && contentDiv.textContent) {
                console.log('找到背景div内容:', contentDiv.textContent.substring(0, 100));
                return contentDiv.textContent;
              }
              
              // 检查整个编辑器的文本内容
              const allText = monacoEditor.textContent;
              if (allText) {
                console.log('找到编辑器文本内容:', allText.substring(0, 100));
                return allText;
              }
            }
            
            // 查找其他可能的编辑器元素
            const editorElements = document.querySelectorAll('[class*="editor"], [class*="Editor"]');
            console.log('找到编辑器元素数量:', editorElements.length);
            
            for (const el of editorElements) {
              const text = el.textContent;
              if (text && text.includes('AI 技术突破')) {
                console.log('找到包含内容的编辑器元素:', el.className, text.substring(0, 100));
                return text;
              }
            }
            
            return null;
          });
          
          console.log('📋 编辑器内容检查结果:', editorContent ? '有内容' : '无内容');
          
          if (editorContent && editorContent.includes('AI 技术突破')) {
            console.log('✅ 编辑器内容正确显示');
            console.log('📋 内容预览:', editorContent.substring(0, 200) + '...');
          } else {
            console.log('❌ 编辑器内容未正确显示或为空');
            
            // 检查页面上的所有文本内容
            const allPageContent = await page.evaluate(() => {
              return document.body.textContent;
            });
            
            if (allPageContent && allPageContent.includes('AI 技术突破')) {
              console.log('✅ 页面中包含文章内容，但可能不在编辑器中');
              console.log('📋 页面内容预览:', allPageContent.substring(0, 300) + '...');
            } else {
              console.log('❌ 页面中也没有找到文章内容');
            }
          }
        } else {
          console.log('❌ 未找到编辑器标签页');
        }
        
      } else {
        console.log('❌ 未找到第一篇文章');
      }
    } else {
      console.log('❌ 未找到 TechCrunch 源');
    }

    // 等待一段时间以便观察结果
    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await browser.close();
    console.log('🔒 浏览器已关闭');
  }
}

testSimpleEditor().catch(console.error);
