const puppeteer = require('puppeteer');

async function quickUpgradeTest() {
    console.log('🚀 开始快速升级验证测试...');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    let allTestsPassed = true;
    
    try {
        // 测试1: 服务器连接
        console.log('\n📋 测试1: 服务器连接');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
        const title = await page.title();
        console.log(`✅ 页面标题: ${title}`);
        
        // 测试2: 基本UI组件
        console.log('\n📋 测试2: 基本UI组件');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const uiElements = await page.evaluate(() => {
            return {
                hasRoot: !!document.getElementById('root'),
                hasActivityBar: !!document.querySelector('[class*="activity"]'),
                hasSidebar: !!document.querySelector('[class*="sidebar"]'),
                hasEditor: !!document.querySelector('[class*="editor"]'),
                hasStatusBar: !!document.querySelector('[class*="status"]')
            };
        });
        
        console.log('UI组件状态:', uiElements);
        
        // 测试3: 控制台错误检查
        console.log('\n📋 测试3: 控制台错误检查');
        const consoleErrors = await page.evaluate(() => {
            return window.consoleErrors || [];
        });
        
        if (consoleErrors.length > 0) {
            console.log('⚠️ 发现控制台错误:');
            consoleErrors.forEach(error => console.log(`  - ${error}`));
        } else {
            console.log('✅ 无控制台错误');
        }
        
        // 测试4: 性能检查
        console.log('\n📋 测试4: 性能检查');
        const performance = await page.evaluate(() => {
            return {
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
            };
        });
        
        console.log(`页面加载时间: ${performance.loadTime}ms`);
        console.log(`DOM就绪时间: ${performance.domReady}ms`);
        
        // 测试5: 截图
        console.log('\n📋 测试5: 截图');
        await page.screenshot({ 
            path: 'test-results/quick-upgrade-test.png', 
            fullPage: true 
        });
        console.log('✅ 截图已保存');
        
        // 总结
        console.log('\n🎯 快速测试总结:');
        console.log(`✅ 服务器连接: 正常`);
        console.log(`✅ UI组件: ${Object.values(uiElements).some(Boolean) ? '正常' : '异常'}`);
        console.log(`✅ 控制台错误: ${consoleErrors.length === 0 ? '无' : `${consoleErrors.length}个`}`);
        console.log(`✅ 性能: 加载时间 ${performance.loadTime}ms`);
        
        allTestsPassed = consoleErrors.length === 0 && Object.values(uiElements).some(Boolean);
        
    } catch (error) {
        console.error('💥 测试失败:', error);
        allTestsPassed = false;
    } finally {
        await browser.close();
    }
    
    if (allTestsPassed) {
        console.log('\n🎉 快速测试通过！升级验证成功！');
        process.exit(0);
    } else {
        console.log('\n⚠️ 快速测试失败，请检查升级结果。');
        process.exit(1);
    }
}

quickUpgradeTest().catch(console.error);
