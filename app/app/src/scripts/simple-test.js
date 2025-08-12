const puppeteer = require('puppeteer');

async function simpleTest() {
    console.log('🧪 简单功能测试...');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    try {
        console.log('🌐 导航到应用...');
        await page.goto('http://localhost:5173/', { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        console.log('⏳ 等待页面加载...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 检查页面标题
        const title = await page.title();
        console.log(`📄 页面标题: ${title}`);
        
        // 检查是否有根元素
        const root = await page.$('#root');
        if (root) {
            console.log('✅ 找到根元素');
        } else {
            console.log('❌ 未找到根元素');
        }
        
        // 检查页面内容
        const content = await page.content();
        console.log(`📊 页面内容长度: ${content.length} 字符`);
        
        // 检查是否有 Molecule 相关元素
        const moleculeElements = await page.$$('[class*="molecule"], [class*="Molecule"]');
        console.log(`🔍 找到 ${moleculeElements.length} 个 Molecule 相关元素`);
        
        // 检查活动栏
        const activityBar = await page.$('[class*="activity"], [class*="ActivityBar"], [data-testid="activityBar"]');
        if (activityBar) {
            console.log('✅ 找到活动栏');
        } else {
            console.log('❌ 未找到活动栏');
        }
        
        // 检查侧边栏
        const sidebar = await page.$('[class*="sidebar"], [class*="Sidebar"]');
        if (sidebar) {
            console.log('✅ 找到侧边栏');
        } else {
            console.log('❌ 未找到侧边栏');
        }
        
        // 检查编辑器
        const editor = await page.$('[class*="editor"], [class*="Editor"]');
        if (editor) {
            console.log('✅ 找到编辑器');
        } else {
            console.log('❌ 未找到编辑器');
        }
        
        // 截图
        await page.screenshot({ path: 'test-screenshot.png' });
        console.log('📸 截图已保存为 test-screenshot.png');
        
    } catch (error) {
        console.error('❌ 测试过程中出错:', error.message);
        
        // 截图错误状态
        try {
            await page.screenshot({ path: 'error-screenshot.png' });
            console.log('📸 错误截图已保存为 error-screenshot.png');
        } catch (screenshotError) {
            console.error('❌ 截图失败:', screenshotError.message);
        }
    } finally {
        await browser.close();
    }
}

simpleTest().catch(console.error);
