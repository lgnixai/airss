const puppeteer = require('puppeteer');

async function detailedAuxiliaryTest() {
    console.log('🔍 详细辅助工具栏测试...');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 收集所有日志
    const logs = [];
    
    page.on('console', msg => {
        logs.push({
            type: msg.type(),
            text: msg.text(),
            timestamp: new Date().toISOString()
        });
    });
    
    try {
        console.log('🌐 导航到应用...');
        await page.goto('http://localhost:5173/', { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        console.log('⏳ 等待页面加载...');
        await new Promise(resolve => setTimeout(resolve, 12000)); // 等待更长时间
        
        // 检查辅助工具栏相关日志
        console.log('\n📊 辅助工具栏相关日志:');
        const auxiliaryLogs = logs.filter(log => 
            log.text.includes('auxiliary') || 
            log.text.includes('Auxiliary') ||
            log.text.includes('AI Assistant') ||
            log.text.includes('AI 助手')
        );
        
        auxiliaryLogs.forEach(log => {
            console.log(`[${log.type}] ${log.text}`);
        });
        
        // 检查辅助工具栏状态
        console.log('\n🔍 检查辅助工具栏状态...');
        
        // 使用 JavaScript 检查辅助工具栏状态
        const auxiliaryState = await page.evaluate(() => {
            // 查找辅助工具栏容器
            const auxiliaryBar = document.querySelector('[class*="auxiliary"], [class*="AuxiliaryBar"], [data-testid*="auxiliary"]');
            
            if (auxiliaryBar) {
                const style = window.getComputedStyle(auxiliaryBar);
                const rect = auxiliaryBar.getBoundingClientRect();
                
                return {
                    found: true,
                    visible: style.display !== 'none' && style.visibility !== 'hidden',
                    width: rect.width,
                    height: rect.height,
                    display: style.display,
                    visibility: style.visibility,
                    position: style.position,
                    zIndex: style.zIndex,
                    className: auxiliaryBar.className,
                    id: auxiliaryBar.id,
                    dataTestId: auxiliaryBar.getAttribute('data-testid')
                };
            } else {
                return { found: false };
            }
        });
        
        if (auxiliaryState.found) {
            console.log('✅ 找到辅助工具栏容器');
            console.log(`- 可见性: ${auxiliaryState.visible ? '可见' : '不可见'}`);
            console.log(`- 尺寸: ${auxiliaryState.width} x ${auxiliaryState.height}`);
            console.log(`- 显示: ${auxiliaryState.display}`);
            console.log(`- 可见性: ${auxiliaryState.visibility}`);
            console.log(`- 位置: ${auxiliaryState.position}`);
            console.log(`- Z索引: ${auxiliaryState.zIndex}`);
            console.log(`- 类名: ${auxiliaryState.className}`);
            console.log(`- ID: ${auxiliaryState.id}`);
            console.log(`- 测试ID: ${auxiliaryState.dataTestId}`);
        } else {
            console.log('❌ 未找到辅助工具栏容器');
        }
        
        // 检查页面布局结构
        console.log('\n🔍 检查页面布局结构...');
        const layoutStructure = await page.evaluate(() => {
            const structure = [];
            
            // 查找主要的布局容器
            const containers = document.querySelectorAll('div, section, main, aside');
            containers.forEach((container, index) => {
                const style = window.getComputedStyle(container);
                const rect = container.getBoundingClientRect();
                
                // 只记录有意义的容器
                if (rect.width > 100 && rect.height > 100) {
                    structure.push({
                        index,
                        tagName: container.tagName,
                        className: container.className,
                        id: container.id,
                        width: rect.width,
                        height: rect.height,
                        position: style.position,
                        display: style.display,
                        left: rect.left,
                        top: rect.top
                    });
                }
            });
            
            return structure;
        });
        
        console.log(`找到 ${layoutStructure.length} 个主要布局容器`);
        
        // 查找右侧面板
        const rightPanels = layoutStructure.filter(container => 
            container.left > 800 || // 在右侧
            container.className.includes('right') ||
            container.className.includes('Right') ||
            container.className.includes('east') ||
            container.className.includes('East') ||
            container.className.includes('auxiliary') ||
            container.className.includes('Auxiliary')
        );
        
        console.log(`找到 ${rightPanels.length} 个可能的右侧面板`);
        rightPanels.forEach((panel, index) => {
            console.log(`  面板 ${index + 1}: ${panel.tagName}.${panel.className} (${panel.width}x${panel.height})`);
        });
        
        // 截图
        await page.screenshot({ path: 'detailed-auxiliary-test.png' });
        console.log('📸 详细测试截图已保存为 detailed-auxiliary-test.png');
        
        // 尝试查找辅助工具栏切换按钮
        console.log('\n🔍 查找辅助工具栏切换按钮...');
        const toggleButtons = await page.evaluate(() => {
            const buttons = [];
            const elements = document.querySelectorAll('button, div, span, a');
            
            elements.forEach(element => {
                const text = element.textContent || element.title || '';
                const className = element.className || '';
                
                if (text.includes('辅助') || 
                    text.includes('auxiliary') || 
                    text.includes('Auxiliary') ||
                    text.includes('面板') ||
                    text.includes('Panel') ||
                    className.includes('toggle') ||
                    className.includes('Toggle')) {
                    
                    const rect = element.getBoundingClientRect();
                    buttons.push({
                        tagName: element.tagName,
                        text: text,
                        className: className,
                        id: element.id,
                        width: rect.width,
                        height: rect.height,
                        left: rect.left,
                        top: rect.top
                    });
                }
            });
            
            return buttons;
        });
        
        console.log(`找到 ${toggleButtons.length} 个可能的切换按钮`);
        toggleButtons.forEach((button, index) => {
            console.log(`  按钮 ${index + 1}: ${button.tagName} "${button.text}" (${button.width}x${button.height})`);
        });
        
        // 尝试点击第一个切换按钮
        if (toggleButtons.length > 0) {
            console.log('\n🖱️ 尝试点击切换按钮...');
            try {
                const firstButton = toggleButtons[0];
                const buttonSelector = `[class*="${firstButton.className.split(' ')[0]}"]`;
                const button = await page.$(buttonSelector);
                
                if (button) {
                    console.log(`✅ 找到按钮 "${firstButton.text}"，尝试点击...`);
                    await button.click();
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    console.log('✅ 按钮点击成功');
                    
                    // 再次截图
                    await page.screenshot({ path: 'after-button-click.png' });
                    console.log('📸 点击后截图已保存为 after-button-click.png');
                }
            } catch (error) {
                console.log('❌ 点击按钮失败:', error.message);
            }
        }
        
    } catch (error) {
        console.error('❌ 测试过程中出错:', error.message);
        
        // 截图错误状态
        try {
            await page.screenshot({ path: 'detailed-auxiliary-error.png' });
            console.log('📸 错误截图已保存为 detailed-auxiliary-error.png');
        } catch (screenshotError) {
            console.error('❌ 截图失败:', screenshotError.message);
        }
    } finally {
        await browser.close();
    }
    
    console.log('\n🎯 详细辅助工具栏测试完成！');
}

detailedAuxiliaryTest().catch(console.error);
