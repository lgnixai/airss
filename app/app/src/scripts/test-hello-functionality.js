#!/usr/bin/env node

const puppeteer = require('puppeteer');

console.log('🧪 测试 Hello 插件功能...\n');

async function testHelloFunctionality() {
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
      if (text.includes('Hello Plugin') || text.includes('sidebar') || text.includes('editor')) {
        consoleMessages.push(text);
      }
    });

    // 查找并点击 Hello 图标
    console.log('🔍 查找 Hello 图标...');
    const helloIcon = await page.$('[title="Hello Plugin"]');
    if (!helloIcon) {
      console.log('❌ 未找到 Hello 图标');
      return;
    }
    console.log('✅ 找到 Hello 图标');

    // 点击 Hello 图标
    console.log('🖱️ 点击 Hello 图标...');
    await helloIcon.click();
    
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

      const helloContent = sidebar.textContent || '';
      const hasHelloWorld = helloContent.includes('Hello World');
      const hasFeatures = helloContent.includes('插件功能');
      const hasTimestamp = helloContent.includes('加载时间');

      return {
        found: true,
        hasHelloWorld,
        hasFeatures,
        hasTimestamp,
        content: helloContent.substring(0, 200) + '...'
      };
    });

    if (sidebarContent.found) {
      console.log('✅ 侧边栏显示正常');
      console.log(`   - Hello World: ${sidebarContent.hasHelloWorld ? '✅' : '❌'}`);
      console.log(`   - 功能列表: ${sidebarContent.hasFeatures ? '✅' : '❌'}`);
      console.log(`   - 时间戳: ${sidebarContent.hasTimestamp ? '✅' : '❌'}`);
    } else {
      console.log('❌ 侧边栏内容检查失败');
    }

    // 检查编辑器内容
    console.log('📝 检查编辑器内容...');
    const editorContent = await page.evaluate(() => {
      const editor = document.querySelector('[class*="editor"]') || 
                    document.querySelector('[class*="Editor"]') ||
                    document.querySelector('[data-testid="editor"]') ||
                    document.querySelector('.monaco-editor');
      
      if (!editor) {
        return { found: false, message: '未找到编辑器' };
      }

      const editorText = editor.textContent || '';
      const hasHelloWorld = editorText.includes('Hello World');
      const hasMarkdown = editorText.includes('# 👋 Hello World');
      const hasFeatures = editorText.includes('功能特性');

      return {
        found: true,
        hasHelloWorld,
        hasMarkdown,
        hasFeatures,
        content: editorText.substring(0, 200) + '...'
      };
    });

    if (editorContent.found) {
      console.log('✅ 编辑器显示正常');
      console.log(`   - Hello World: ${editorContent.hasHelloWorld ? '✅' : '❌'}`);
      console.log(`   - Markdown 格式: ${editorContent.hasMarkdown ? '✅' : '❌'}`);
      console.log(`   - 功能说明: ${editorContent.hasFeatures ? '✅' : '❌'}`);
    } else {
      console.log('❌ 编辑器内容检查失败');
    }

    // 检查通知
    console.log('🔔 检查通知...');
    const notification = await page.evaluate(() => {
      // 检查多种可能的通知元素
      const notices = document.querySelectorAll('[style*="position: fixed"][style*="top: 20px"], [style*="position: fixed"][style*="right: 20px"], .notification, [class*="notification"]');
      return notices.length > 0;
    });

    console.log(`通知显示: ${notification ? '✅' : '❌'}`);
    
    // 如果通知没有显示，检查是否有通知相关的控制台消息
    if (!notification) {
      const hasNoticeMessage = consoleMessages.some(msg => msg.includes('Hello World! 👋'));
      console.log(`通知消息: ${hasNoticeMessage ? '✅' : '❌'}`);
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
    console.log(`  ${editorContent.found ? '✅' : '❌'} 编辑器: ${editorContent.found ? '正常' : '失败'}`);
    console.log(`  ${notification ? '✅' : '❌'} 通知: ${notification ? '正常' : '失败'}`);

    if (sidebarContent.found && editorContent.found && notification) {
      console.log('\n🎉 Hello 插件功能测试通过！');
    } else {
      console.log('\n⚠️ Hello 插件功能测试部分失败，需要进一步检查');
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
testHelloFunctionality().catch(console.error);
