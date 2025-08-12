#!/usr/bin/env node

const puppeteer = require('puppeteer');

console.log('🧪 测试 Excalidraw 插件...\n');

async function testExcalidrawPlugin() {
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
      if (text.includes('Excalidraw Plugin') || text.includes('excalidraw')) {
        consoleMessages.push(text);
      }
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
      const hasExcalidraw = excalidrawContent.includes('Excalidraw');
      const hasToolbar = excalidrawContent.includes('绘图工具');
      const hasCanvas = excalidrawContent.includes('画布预览');
      const hasFeatures = excalidrawContent.includes('功能特性');

      return {
        found: true,
        hasExcalidraw,
        hasToolbar,
        hasCanvas,
        hasFeatures,
        content: excalidrawContent.substring(0, 200) + '...'
      };
    });

    if (sidebarContent.found) {
      console.log('✅ 侧边栏显示正常');
      console.log(`   - Excalidraw 标题: ${sidebarContent.hasExcalidraw ? '✅' : '❌'}`);
      console.log(`   - 绘图工具: ${sidebarContent.hasToolbar ? '✅' : '❌'}`);
      console.log(`   - 画布预览: ${sidebarContent.hasCanvas ? '✅' : '❌'}`);
      console.log(`   - 功能特性: ${sidebarContent.hasFeatures ? '✅' : '❌'}`);
    } else {
      console.log('❌ 侧边栏内容检查失败');
    }

    // 检查工具栏按钮
    console.log('🛠️ 检查工具栏按钮...');
    const toolbarButtons = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button[title]');
      const toolButtons = Array.from(buttons).filter(btn => {
        const title = btn.getAttribute('title');
        return title && (title.includes('画笔') || title.includes('直线') || title.includes('矩形') || 
                        title.includes('圆形') || title.includes('文本') || title.includes('箭头') || 
                        title.includes('清除'));
      });
      
      return {
        count: toolButtons.length,
        titles: toolButtons.map(btn => btn.getAttribute('title'))
      };
    });

    console.log(`工具栏按钮: ${toolbarButtons.count} 个`);
    console.log(`按钮列表: ${toolbarButtons.titles.join(', ')}`);

    // 检查画布
    console.log('🎨 检查画布...');
    const canvas = await page.evaluate(() => {
      const canvasElement = document.getElementById('excalidraw-canvas');
      return {
        found: !!canvasElement,
        hasPlaceholder: canvasElement ? canvasElement.textContent.includes('点击开始绘制') : false
      };
    });

    console.log(`画布显示: ${canvas.found ? '✅' : '❌'}`);
    console.log(`画布占位符: ${canvas.hasPlaceholder ? '✅' : '❌'}`);

    // 测试工具按钮点击
    console.log('🖱️ 测试工具按钮点击...');
    const toolButton = await page.$('button[title="画笔"]');
    if (toolButton) {
      await toolButton.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ 画笔工具按钮点击成功');
    } else {
      console.log('❌ 未找到画笔工具按钮');
    }

    // 检查通知
    console.log('🔔 检查通知...');
    const notification = await page.evaluate(() => {
      const notices = document.querySelectorAll('[style*="position: fixed"][style*="top: 20px"], [style*="position: fixed"][style*="right: 20px"], .notification, [class*="notification"]');
      return notices.length > 0;
    });

    console.log(`通知显示: ${notification ? '✅' : '❌'}`);

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
    console.log(`  ${toolbarButtons.count > 0 ? '✅' : '❌'} 工具栏: ${toolbarButtons.count > 0 ? '正常' : '失败'}`);
    console.log(`  ${canvas.found ? '✅' : '❌'} 画布: ${canvas.found ? '正常' : '失败'}`);
    console.log(`  ${notification ? '✅' : '❌'} 通知: ${notification ? '正常' : '失败'}`);

    if (sidebarContent.found && toolbarButtons.count > 0 && canvas.found) {
      console.log('\n🎉 Excalidraw 插件功能测试通过！');
    } else {
      console.log('\n⚠️ Excalidraw 插件功能测试部分失败，需要进一步检查');
    }

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 运行测试
testExcalidrawPlugin().catch(console.error);
