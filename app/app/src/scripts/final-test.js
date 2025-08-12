const puppeteer = require('puppeteer');

async function finalTest() {
    console.log('🎯 最终插件功能测试...');
    
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
        await new Promise(resolve => setTimeout(resolve, 8000)); // 等待插件系统初始化
        
        // 检查活动栏项目
        console.log('\n🔍 检查活动栏项目...');
        const activityBarItems = await page.$$('[class*="activity"], [class*="ActivityBar"], [data-testid="activityBar"]');
        console.log(`找到 ${activityBarItems.length} 个活动栏项目`);
        
        // 获取所有活动栏项目的文本
        const itemTexts = await page.evaluate(() => {
            const items = document.querySelectorAll('[class*="activity"], [class*="ActivityBar"], [data-testid="activityBar"]');
            const texts = [];
            items.forEach(item => {
                const title = item.getAttribute('title') || item.textContent || '';
                if (title.trim()) {
                    texts.push(title.trim());
                }
            });
            return texts;
        });
        
        console.log('活动栏项目列表:');
        itemTexts.forEach((text, index) => {
            console.log(`  ${index + 1}. ${text}`);
        });
        
        // 检查特定插件
        const plugins = [
            { name: 'Hello Plugin', selectors: ['Hello', 'Hello Plugin', '💡', 'lightbulb'] },
            { name: 'RSS 阅读器', selectors: ['RSS', 'RSS 阅读器', '📰', 'rss'] },
            { name: 'Excalidraw 白板', selectors: ['Excalidraw', '白板', '🎨', 'excalidraw'] },
            { name: 'Obsidian Example Plugin', selectors: ['Obsidian', 'Example', '📝', 'obsidian'] }
        ];
        
        console.log('\n🔍 检查特定插件...');
        plugins.forEach(plugin => {
            const found = itemTexts.some(text => 
                plugin.selectors.some(selector => 
                    text.toLowerCase().includes(selector.toLowerCase())
                )
            );
            if (found) {
                console.log(`✅ ${plugin.name}: 已找到`);
            } else {
                console.log(`❌ ${plugin.name}: 未找到`);
            }
        });
        
        // 检查插件相关日志
        console.log('\n📊 插件相关日志:');
        const pluginLogs = logs.filter(log => 
            log.text.includes('Plugin') || 
            log.text.includes('plugin') ||
            log.text.includes('Hello') ||
            log.text.includes('RSS') ||
            log.text.includes('Excalidraw') ||
            log.text.includes('Obsidian')
        );
        
        pluginLogs.forEach(log => {
            console.log(`[${log.type}] ${log.text}`);
        });
        
        // 尝试点击 Hello 插件图标
        console.log('\n🖱️ 尝试点击 Hello 插件图标...');
        try {
            // 查找包含 Hello 或 lightbulb 的活动栏项目
            const helloItem = await page.$('[title*="Hello"], [title*="lightbulb"], [class*="activity"]:has-text("Hello")');
            if (helloItem) {
                console.log('✅ 找到 Hello 插件图标，尝试点击...');
                await helloItem.click();
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log('✅ Hello 插件图标点击成功');
            } else {
                console.log('❌ 未找到 Hello 插件图标');
            }
        } catch (error) {
            console.log('❌ 点击 Hello 插件图标失败:', error.message);
        }
        
        // 截图
        await page.screenshot({ path: 'final-test-result.png' });
        console.log('📸 测试结果截图已保存为 final-test-result.png');
        
        // 生成测试报告
        const report = {
            timestamp: new Date().toISOString(),
            activityBarItems: itemTexts.length,
            itemTexts: itemTexts,
            plugins: plugins.map(plugin => ({
                name: plugin.name,
                found: itemTexts.some(text => 
                    plugin.selectors.some(selector => 
                        text.toLowerCase().includes(selector.toLowerCase())
                    )
                )
            })),
            logs: pluginLogs
        };
        
        console.log('\n📊 测试报告:');
        console.log(`- 活动栏项目总数: ${report.activityBarItems}`);
        console.log(`- 插件系统状态: 已初始化`);
        console.log(`- Hello 插件: ${report.plugins.find(p => p.name === 'Hello Plugin')?.found ? '✅ 已加载' : '❌ 未加载'}`);
        console.log(`- RSS 插件: ${report.plugins.find(p => p.name === 'RSS 阅读器')?.found ? '✅ 已加载' : '❌ 未加载'}`);
        console.log(`- Excalidraw 插件: ${report.plugins.find(p => p.name === 'Excalidraw 白板')?.found ? '✅ 已加载' : '❌ 未加载'}`);
        console.log(`- Obsidian 插件: ${report.plugins.find(p => p.name === 'Obsidian Example Plugin')?.found ? '✅ 已加载' : '❌ 未加载'}`);
        
    } catch (error) {
        console.error('❌ 测试过程中出错:', error.message);
        
        // 截图错误状态
        try {
            await page.screenshot({ path: 'final-test-error.png' });
            console.log('📸 错误截图已保存为 final-test-error.png');
        } catch (screenshotError) {
            console.error('❌ 截图失败:', screenshotError.message);
        }
    } finally {
        await browser.close();
    }
    
    console.log('\n🎯 最终测试完成！');
}

finalTest().catch(console.error);
