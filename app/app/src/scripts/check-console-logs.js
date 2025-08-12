const puppeteer = require('puppeteer');

async function checkConsoleLogs() {
    console.log('🔍 检查浏览器控制台日志...');
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 收集控制台日志
    const logs = [];
    const errors = [];
    
    page.on('console', msg => {
        logs.push({
            type: msg.type(),
            text: msg.text(),
            timestamp: new Date().toISOString()
        });
        console.log(`[${msg.type()}] ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
        errors.push({
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        console.error(`❌ 页面错误: ${error.message}`);
    });
    
    try {
        console.log('🌐 导航到应用...');
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
        
        console.log('⏳ 等待页面加载...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 检查是否有插件相关的日志
        const pluginLogs = logs.filter(log => 
            log.text.includes('Plugin') || 
            log.text.includes('plugin') ||
            log.text.includes('Hello') ||
            log.text.includes('Molecule')
        );
        
        console.log('\n📊 插件相关日志:');
        pluginLogs.forEach(log => {
            console.log(`[${log.type}] ${log.text}`);
        });
        
        // 检查错误
        if (errors.length > 0) {
            console.log('\n❌ 页面错误:');
            errors.forEach(error => {
                console.log(`错误: ${error.message}`);
                console.log(`堆栈: ${error.stack}`);
            });
        }
        
        // 检查活动栏
        console.log('\n🔍 检查活动栏...');
        const activityBarItems = await page.$$('[class*="activity"], [class*="ActivityBar"], [data-testid="activityBar"]');
        console.log(`找到 ${activityBarItems.length} 个活动栏项目`);
        
        // 检查是否有 Hello 图标
        const helloIcon = await page.$('text=Hello, text=💡, text=lightbulb');
        if (helloIcon) {
            console.log('✅ 找到 Hello 图标');
        } else {
            console.log('❌ 未找到 Hello 图标');
        }
        
    } catch (error) {
        console.error('❌ 检查过程中出错:', error.message);
    } finally {
        await browser.close();
    }
}

checkConsoleLogs().catch(console.error);
