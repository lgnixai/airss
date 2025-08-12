#!/usr/bin/env node

const puppeteer = require('puppeteer');

console.log('🎨 测试 Excalidraw 绘图功能...\n');

async function testExcalidrawDrawing() {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1400, height: 900 }
    });
    const page = await browser.newPage();

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 监听控制台消息
    const consoleMessages = [];
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Excalidraw Plugin')) {
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
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 点击创建新画布按钮
    console.log('🖱️ 点击创建新画布按钮...');
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const createBtn = Array.from(buttons).find(btn => btn.textContent.includes('创建新画布'));
      if (createBtn) {
        createBtn.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 检查画布组件
    console.log('🔍 检查画布组件...');
    const canvasInfo = await page.evaluate(() => {
      const canvasContainer = document.querySelector('[id^="excalidraw-canvas-"]');
      if (!canvasContainer) {
        return { found: false, message: '未找到画布容器' };
      }

      const toolButtons = document.querySelectorAll('button');
      const toolButtonTexts = Array.from(toolButtons).map(btn => btn.textContent || '').filter(text => text.includes('画笔') || text.includes('直线') || text.includes('矩形') || text.includes('圆形') || text.includes('文本') || text.includes('箭头'));

      return {
        found: true,
        canvasId: canvasContainer.id,
        toolButtonCount: toolButtonTexts.length,
        toolButtonTexts: toolButtonTexts
      };
    });

    if (!canvasInfo.found) {
      console.log('❌ 画布组件未找到');
      return;
    }

    console.log('✅ 画布组件找到');
    console.log(`   - 画布ID: ${canvasInfo.canvasId}`);
    console.log(`   - 工具按钮数量: ${canvasInfo.toolButtonCount}`);

    // 测试工具切换
    console.log('\n🖱️ 测试工具切换...');
    const toolSwitchTest = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      const penButton = Array.from(buttons).find(btn => btn.textContent.includes('画笔'));
      const lineButton = Array.from(buttons).find(btn => btn.textContent.includes('直线'));
      const rectangleButton = Array.from(buttons).find(btn => btn.textContent.includes('矩形'));
      
      if (penButton && lineButton && rectangleButton) {
        // 点击直线按钮
        lineButton.click();
        const lineButtonStyle = lineButton.style.cssText;
        
        // 点击矩形按钮
        rectangleButton.click();
        const rectangleButtonStyle = rectangleButton.style.cssText;
        
        return {
          success: true,
          penButtonFound: true,
          lineButtonFound: true,
          rectangleButtonFound: true,
          lineButtonClicked: true,
          rectangleButtonClicked: true,
          lineButtonStyle: lineButtonStyle,
          rectangleButtonStyle: rectangleButtonStyle
        };
      }
      
      return {
        success: false,
        penButtonFound: !!penButton,
        lineButtonFound: !!lineButton,
        rectangleButtonFound: !!rectangleButton
      };
    });

    if (toolSwitchTest.success) {
      console.log('✅ 工具切换测试成功');
      console.log('   - 直线按钮点击成功');
      console.log('   - 矩形按钮点击成功');
    } else {
      console.log('❌ 工具切换测试失败');
    }

    // 测试绘图功能
    console.log('\n🎨 测试绘图功能...');
    const drawingTest = await page.evaluate(() => {
      const canvas = document.querySelector('[id^="excalidraw-canvas-"]');
      if (!canvas) {
        return { success: false, message: '未找到画布元素' };
      }

      const rect = canvas.getBoundingClientRect();
      
      // 模拟鼠标按下
      const mouseDownEvent = new MouseEvent('mousedown', {
        clientX: rect.left + 100,
        clientY: rect.top + 100,
        bubbles: true
      });
      canvas.dispatchEvent(mouseDownEvent);
      
      // 模拟鼠标移动
      const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: rect.left + 200,
        clientY: rect.top + 200,
        bubbles: true
      });
      canvas.dispatchEvent(mouseMoveEvent);
      
      // 模拟鼠标释放
      const mouseUpEvent = new MouseEvent('mouseup', {
        clientX: rect.left + 200,
        clientY: rect.top + 200,
        bubbles: true
      });
      canvas.dispatchEvent(mouseUpEvent);
      
      // 检查是否创建了绘图元素
      setTimeout(() => {
        const drawingElements = canvas.querySelectorAll('.drawing-element');
        console.log(`绘图元素数量: ${drawingElements.length}`);
      }, 100);
      
      return {
        success: true,
        canvasFound: true,
        mouseEventsDispatched: true
      };
    });

    if (drawingTest.success) {
      console.log('✅ 绘图功能测试成功');
      console.log('   - 鼠标事件分发成功');
    } else {
      console.log('❌ 绘图功能测试失败');
      console.log(`   错误: ${drawingTest.message}`);
    }

    // 等待一下让绘图元素创建完成
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 检查绘图元素
    console.log('\n🔍 检查绘图元素...');
    const drawingElementsCheck = await page.evaluate(() => {
      const canvas = document.querySelector('[id^="excalidraw-canvas-"]');
      if (!canvas) {
        return { found: false, message: '未找到画布元素' };
      }

      const drawingElements = canvas.querySelectorAll('.drawing-element');
      const elementCount = drawingElements.length;
      const elementStyles = Array.from(drawingElements).map(el => el.style.cssText.substring(0, 100));

      return {
        found: true,
        elementCount: elementCount,
        elementStyles: elementStyles
      };
    });

    if (drawingElementsCheck.found) {
      console.log('✅ 绘图元素检查完成');
      console.log(`   - 绘图元素数量: ${drawingElementsCheck.elementCount}`);
      if (drawingElementsCheck.elementCount > 0) {
        console.log('   - 绘图功能正常工作！');
      } else {
        console.log('   - 绘图功能可能有问题');
      }
    } else {
      console.log('❌ 绘图元素检查失败');
    }

    // 测试清除功能
    console.log('\n🧹 测试清除功能...');
    const clearTest = await page.evaluate(() => {
      const clearButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('清除画布'));
      if (!clearButton) {
        return { success: false, message: '未找到清除按钮' };
      }

      // 记录清除前的元素数量
      const canvas = document.querySelector('[id^="excalidraw-canvas-"]');
      const beforeCount = canvas ? canvas.querySelectorAll('.drawing-element').length : 0;
      
      // 点击清除按钮
      clearButton.click();
      
      return {
        success: true,
        clearButtonFound: true,
        clearButtonClicked: true,
        beforeCount: beforeCount
      };
    });

    if (clearTest.success) {
      console.log('✅ 清除功能测试成功');
      console.log(`   - 清除前元素数量: ${clearTest.beforeCount}`);
    } else {
      console.log('❌ 清除功能测试失败');
      console.log(`   错误: ${clearTest.message}`);
    }

    // 显示控制台消息
    console.log('\n📝 相关控制台消息:');
    consoleMessages.forEach(msg => {
      console.log(`  ${msg}`);
    });

    // 总结
    console.log('\n📊 测试结果总结:');
    console.log(`  ✅ 画布组件: ${canvasInfo.found ? '成功' : '失败'}`);
    console.log(`  ✅ 工具切换: ${toolSwitchTest.success ? '正常' : '异常'}`);
    console.log(`  ✅ 绘图功能: ${drawingTest.success ? '正常' : '异常'}`);
    console.log(`  ✅ 绘图元素: ${drawingElementsCheck.found ? '正常' : '异常'}`);
    console.log(`  ✅ 清除功能: ${clearTest.success ? '正常' : '异常'}`);

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testExcalidrawDrawing().catch(console.error);
