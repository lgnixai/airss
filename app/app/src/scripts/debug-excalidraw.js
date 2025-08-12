#!/usr/bin/env node

const puppeteer = require('puppeteer');

console.log('🔍 调试 Excalidraw 插件...\n');

async function debugExcalidraw() {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 }
    });
    const page = await browser.newPage();

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 监听所有控制台消息
    const consoleMessages = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push(text);
    });

    // 检查页面上的所有活动栏项目
    console.log('🔍 检查活动栏项目...');
    const activityBarItems = await page.evaluate(() => {
      const items = document.querySelectorAll('[class*="activityBar"] [class*="item"]');
      return Array.from(items).map(item => ({
        title: item.getAttribute('title') || item.textContent || '',
        visible: item.offsetParent !== null
      }));
    });
    
    console.log('活动栏项目:');
    activityBarItems.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.title} (${item.visible ? '可见' : '不可见'})`);
    });

    // 查找 Excalidraw 图标
    const excalidrawIcon = await page.$('[title="Excalidraw 白板"]');
    if (excalidrawIcon) {
      console.log('✅ 找到 Excalidraw 图标');
      
      // 点击图标
      await excalidrawIcon.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 检查控制台消息
      console.log('\n📝 控制台消息:');
      consoleMessages.forEach(msg => {
        if (msg.includes('Plugin') || msg.includes('excalidraw') || msg.includes('Excalidraw')) {
          console.log(`  ${msg}`);
        }
      });
      
      // 检查侧边栏
      const sidebarInfo = await page.evaluate(() => {
        const sidebar = document.querySelector('[class*="sidebar"]') || 
                       document.querySelector('[class*="Sidebar"]');
        
        if (!sidebar) {
          return { found: false, message: '未找到侧边栏' };
        }
        
        const content = sidebar.textContent || '';
        const buttons = sidebar.querySelectorAll('button');
        
        return {
          found: true,
          content: content.substring(0, 300),
          buttonCount: buttons.length,
          buttonTexts: Array.from(buttons).map(btn => btn.textContent || '')
        };
      });
      
      console.log('\n📋 侧边栏信息:');
      if (sidebarInfo.found) {
        console.log(`  内容: ${sidebarInfo.content}`);
        console.log(`  按钮数量: ${sidebarInfo.buttonCount}`);
        console.log(`  按钮文本: ${sidebarInfo.buttonTexts.join(', ')}`);
        
        // 尝试点击创建新画布按钮
        if (sidebarInfo.buttonCount > 0) {
          console.log('\n🖱️ 尝试点击创建新画布按钮...');
          await page.evaluate(() => {
            const buttons = document.querySelectorAll('button');
            const createBtn = Array.from(buttons).find(btn => btn.textContent.includes('创建新画布'));
            if (createBtn) {
              createBtn.click();
            }
          });
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // 检查是否打开了新标签页
          const tabs = await page.evaluate(() => {
            const tabElements = document.querySelectorAll('[class*="tab"], [class*="Tab"]');
            return Array.from(tabElements).map(tab => tab.textContent || tab.title || '').filter(text => text.includes('画布'));
          });
          
          console.log(`找到的画布标签页: ${tabs.length} 个`);
          tabs.forEach(tab => console.log(`  - ${tab}`));
        }
      } else {
        console.log(`  错误: ${sidebarInfo.message}`);
      }
      
    } else {
      console.log('❌ 未找到 Excalidraw 图标');
    }

  } catch (error) {
    console.error('❌ 调试过程中发生错误:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

debugExcalidraw().catch(console.error);
