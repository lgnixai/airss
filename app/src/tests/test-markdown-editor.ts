import puppeteer from 'puppeteer';

async function testMarkdownEditor() {
  console.log('🔍 开始测试 Markdown 编辑器...');
  
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
        await page.waitForTimeout(5000);
        
        // 检查编辑器状态
        const editorStatus = await page.evaluate(() => {
          // 查找Monaco编辑器
          const monacoEditor = document.querySelector('.monaco-editor');
          if (monacoEditor) {
            console.log('找到Monaco编辑器');
            
            // 检查编辑器是否可见
            const isVisible = monacoEditor.offsetWidth > 0 && monacoEditor.offsetHeight > 0;
            console.log('编辑器是否可见:', isVisible);
            
            // 检查编辑器内容
            const textArea = monacoEditor.querySelector('textarea');
            if (textArea) {
              console.log('找到textarea, 内容长度:', textArea.value.length);
              console.log('textarea内容预览:', textArea.value.substring(0, 100));
              return {
                found: true,
                hasContent: textArea.value.length > 0,
                contentPreview: textArea.value.substring(0, 100),
                isVisible: isVisible
              };
            }
            
            // 检查其他可能的内容元素
            const contentElements = monacoEditor.querySelectorAll('*');
            for (const el of contentElements) {
              if (el.textContent && el.textContent.includes('AI 技术突破')) {
                console.log('找到包含内容的元素:', el.tagName, el.className);
                return {
                  found: true,
                  hasContent: true,
                  contentPreview: el.textContent.substring(0, 100),
                  isVisible: isVisible
                };
              }
            }
            
            return {
              found: true,
              hasContent: false,
              contentPreview: '',
              isVisible: isVisible
            };
          }
          
          return {
            found: false,
            hasContent: false,
            contentPreview: '',
            isVisible: false
          };
        });
        
        console.log('📋 编辑器状态:', editorStatus);
        
        if (editorStatus.found) {
          if (editorStatus.hasContent) {
            console.log('✅ 编辑器内容正确显示');
            console.log('📋 内容预览:', editorStatus.contentPreview);
          } else {
            console.log('❌ 编辑器存在但没有内容');
            
            // 尝试检查是否有语法高亮或其他渲染问题
            const syntaxInfo = await page.evaluate(() => {
              const monacoEditor = document.querySelector('.monaco-editor');
              if (monacoEditor) {
                // 检查是否有语法高亮元素
                const tokens = monacoEditor.querySelectorAll('[class*="token"], [class*="syntax"]');
                console.log('语法高亮元素数量:', tokens.length);
                
                // 检查编辑器配置
                const editorElement = monacoEditor.querySelector('[data-uri]');
                if (editorElement) {
                  console.log('编辑器URI:', editorElement.getAttribute('data-uri'));
                }
                
                return {
                  tokenCount: tokens.length,
                  hasUri: !!editorElement
                };
              }
              return { tokenCount: 0, hasUri: false };
            });
            
            console.log('📋 语法高亮信息:', syntaxInfo);
          }
        } else {
          console.log('❌ 未找到Monaco编辑器');
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

testMarkdownEditor().catch(console.error);
