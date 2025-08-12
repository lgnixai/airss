const puppeteer = require('puppeteer');

async function testAuxiliaryBar() {
    console.log('🔍 测试辅助工具栏...');
    
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
        await new Promise(resolve => setTimeout(resolve, 10000)); // 等待更长时间
        
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
        
        // 检查辅助工具栏元素
        console.log('\n🔍 检查辅助工具栏元素...');
        
        // 查找辅助工具栏容器
        const auxiliaryBar = await page.$('[class*="auxiliary"], [class*="AuxiliaryBar"], [data-testid*="auxiliary"]');
        if (auxiliaryBar) {
            console.log('✅ 找到辅助工具栏容器');
        } else {
            console.log('❌ 未找到辅助工具栏容器');
        }
        
        // 查找所有可能的辅助工具栏元素
        const auxiliaryElements = await page.$$('[class*="auxiliary"], [class*="AuxiliaryBar"], [data-testid*="auxiliary"], [class*="panel"], [class*="Panel"]');
        console.log(`🔍 找到 ${auxiliaryElements.length} 个可能的辅助工具栏元素`);
        
        // 检查页面布局
        console.log('\n🔍 检查页面布局...');
        const layoutElements = await page.$$('[class*="layout"], [class*="Layout"], [class*="workbench"], [class*="Workbench"]');
        console.log(`🔍 找到 ${layoutElements.length} 个布局相关元素`);
        
        // 检查是否有右侧面板
        const rightPanel = await page.$('[class*="right"], [class*="Right"], [class*="east"], [class*="East"]');
        if (rightPanel) {
            console.log('✅ 找到右侧面板');
        } else {
            console.log('❌ 未找到右侧面板');
        }
        
        // 检查页面内容
        const content = await page.content();
        console.log(`📊 页面内容长度: ${content.length} 字符`);
        
        // 查找包含 "AI 助手" 或 "AI Assistant" 的元素
        const aiElements = await page.$$('text=AI 助手, text=AI Assistant, text=lightbulb');
        console.log(`🔍 找到 ${aiElements.length} 个 AI 相关元素`);
        
        // 截图
        await page.screenshot({ path: 'auxiliary-bar-test.png' });
        console.log('📸 测试截图已保存为 auxiliary-bar-test.png');
        
        // 尝试手动触发辅助工具栏显示
        console.log('\n🖱️ 尝试手动触发辅助工具栏...');
        try {
            // 查找可能的辅助工具栏切换按钮
            const toggleButton = await page.$('[class*="toggle"], [class*="Toggle"], [title*="辅助"], [title*="auxiliary"]');
            if (toggleButton) {
                console.log('✅ 找到辅助工具栏切换按钮，尝试点击...');
                await toggleButton.click();
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log('✅ 切换按钮点击成功');
            } else {
                console.log('❌ 未找到辅助工具栏切换按钮');
            }
        } catch (error) {
            console.log('❌ 切换辅助工具栏失败:', error.message);
        }
        
        // 最终截图
        await page.screenshot({ path: 'auxiliary-bar-final.png' });
        console.log('📸 最终截图已保存为 auxiliary-bar-final.png');
        
    } catch (error) {
        console.error('❌ 测试过程中出错:', error.message);
        
        // 截图错误状态
        try {
            await page.screenshot({ path: 'auxiliary-bar-error.png' });
            console.log('📸 错误截图已保存为 auxiliary-bar-error.png');
        } catch (screenshotError) {
            console.error('❌ 截图失败:', screenshotError.message);
        }
    } finally {
        await browser.close();
    }
    
    console.log('\n🎯 辅助工具栏测试完成！');
}

testAuxiliaryBar().catch(console.error);
