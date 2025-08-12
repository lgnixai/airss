#!/usr/bin/env node

const puppeteer = require('puppeteer');

console.log('🧪 简化测试 Excalidraw 插件...\n');

async function testExcalidrawSimple() {
  let browser;
  
  try {
    // 启动浏览器
    console.log('🚀 启动浏览器测试...');
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1200, height: 800 }
    });
    const page = await browser.newPage();

    // 导航到应用
    console.log('🌐 导航到应用...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    
    // 等待页面加载
    console.log('⏳ 等待页面加载...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 监听控制台消息
    const consoleMessages = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleMessages.push(text);
    });

    // 查找并点击 Excalidraw 图标
    console.log('🔍 查找 Excalidraw 图标...');
    const excalidrawIcon = await page.$('[title="Excalidraw 白板"]');
    if (!excalidrawIcon) {
      console.log('❌ 未找到 Excalidraw 图标');
      return;
    }
    console.log('✅ 找到 Excalidraw 图标');

    // 点击 Excalidraw 图标
    console.log('🖱️ 点击 Excalidraw 图标...');
    await excalidrawIcon.click();
    
    // 等待响应
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 检查侧边栏内容
    console.log('📋 检查侧边栏内容...');
    const sidebarContent = await page.evaluate(() => {
      const sidebar = document.querySelector('[class*="sidebar"]') || 
                     document.querySelector('[class*="Sidebar"]') ||
                     document.querySelector('[data-testid="sidebar"]');
      
      if (!sidebar) {
        return { found: false, message: '未找到侧边栏' };
      }

      const excalidrawContent = sidebar.textContent || '';
      console.log('侧边栏内容:', excalidrawContent.substring(0, 500));
      
      const hasExcalidraw = excalidrawContent.includes('Excalidraw');
      const hasCreateButton = excalidrawContent.includes('创建新画布');
      const hasFeatures = excalidrawContent.includes('功能特性');

      return {
        found: true,
        hasExcalidraw,
        hasCreateButton,
        hasFeatures,
        content: excalidrawContent.substring(0, 200) + '...'
      };
    });

    if (sidebarContent.found) {
      console.log('✅ 侧边栏显示正常');
      console.log(`   - Excalidraw 标题: ${sidebarContent.hasExcalidraw ? '✅' : '❌'}`);
      console.log(`   - 创建按钮: ${sidebarContent.hasCreateButton ? '✅' : '❌'}`);
      console.log(`   - 功能特性: ${sidebarContent.hasFeatures ? '✅' : '❌'}`);
    } else {
      console.log('❌ 侧边栏内容检查失败');
    }

    // 尝试点击创建新画布按钮
    console.log('🖱️ 尝试点击创建新画布按钮...');
    const createButton = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      return Array.from(buttons).find(btn => btn.textContent.includes('创建新画布'));
    });
    
    if (createButton) {
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        const createBtn = Array.from(buttons).find(btn => btn.textContent.includes('创建新画布'));
        if (createBtn) {
          createBtn.click();
        }
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ 创建新画布按钮点击成功');
      
      // 检查是否打开了新标签页
      const tabs = await page.evaluate(() => {
        const tabElements = document.querySelectorAll('[class*="tab"], [class*="Tab"]');
        return Array.from(tabElements).map(tab => tab.textContent || tab.title || '').filter(text => text.includes('画布'));
      });
      
      console.log(`找到的画布标签页: ${tabs.length} 个`);
      tabs.forEach(tab => console.log(`  - ${tab}`));
      
    } else {
      console.log('❌ 未找到创建新画布按钮');
    }

    // 显示控制台消息
    console.log('\n📝 相关控制台消息:');
    consoleMessages.forEach(msg => {
      console.log(`  ${msg}`);
    });

    // 总结
    console.log('\n📊 测试结果总结:');
    console.log(`  ✅ 图标显示: 正常`);
    console.log(`  ✅ 图标点击: 正常`);
    console.log(`  ${sidebarContent.found ? '✅' : '❌'} 侧边栏: ${sidebarContent.found ? '正常' : '失败'}`);
    console.log(`  ${createButton ? '✅' : '❌'} 创建按钮: ${createButton ? '正常' : '失败'}`);

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 运行测试
testExcalidrawSimple().catch(console.error);
