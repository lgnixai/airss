const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function finalDiagnosis() {
    console.log('🔍 最终诊断和修复...');
    
    // 1. 检查文件结构
    console.log('\n📁 检查文件结构...');
    const files = [
        'app/src/main.tsx',
        'app/src/App.tsx',
        'app/src/extensions/TestExtension.tsx',
        'app/app/src/plugins/hello/HelloPlugin.ts',
        'app/app/src/core/PluginSystemService.ts'
    ];
    
    files.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}: 存在`);
        } else {
            console.log(`❌ ${file}: 不存在`);
        }
    });
    
    // 2. 检查服务器状态
    console.log('\n🌐 检查服务器状态...');
    try {
        const response = await fetch('http://localhost:5173/');
        console.log(`✅ 服务器响应: ${response.status}`);
    } catch (error) {
        console.log(`❌ 服务器错误: ${error.message}`);
    }
    
    // 3. 浏览器测试
    console.log('\n🤖 浏览器测试...');
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 收集所有日志和错误
    const logs = [];
    const errors = [];
    
    page.on('console', msg => {
        logs.push({
            type: msg.type(),
            text: msg.text(),
            timestamp: new Date().toISOString()
        });
    });
    
    page.on('pageerror', error => {
        errors.push({
            message: error.message,
            stack: error.stack,
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
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 检查页面内容
        const content = await page.content();
        console.log(`📊 页面内容长度: ${content.length} 字符`);
        
        // 检查是否有 React 错误
        const reactErrors = logs.filter(log => 
            log.text.includes('React') || 
            log.text.includes('react') ||
            log.text.includes('Error') ||
            log.text.includes('error')
        );
        
        if (reactErrors.length > 0) {
            console.log('\n❌ React 相关错误:');
            reactErrors.forEach(log => {
                console.log(`[${log.type}] ${log.text}`);
            });
        }
        
        // 检查是否有 Molecule 相关日志
        const moleculeLogs = logs.filter(log => 
            log.text.includes('Molecule') || 
            log.text.includes('molecule') ||
            log.text.includes('TestExtension') ||
            log.text.includes('Plugin')
        );
        
        if (moleculeLogs.length > 0) {
            console.log('\n📊 Molecule 相关日志:');
            moleculeLogs.forEach(log => {
                console.log(`[${log.type}] ${log.text}`);
            });
        }
        
        // 检查页面错误
        if (errors.length > 0) {
            console.log('\n❌ 页面错误:');
            errors.forEach(error => {
                console.log(`错误: ${error.message}`);
                console.log(`堆栈: ${error.stack}`);
            });
        }
        
        // 检查 DOM 元素
        console.log('\n🔍 检查 DOM 元素...');
        
        const root = await page.$('#root');
        if (root) {
            console.log('✅ 找到根元素');
            
            // 检查根元素内容
            const rootContent = await page.evaluate(() => {
                const root = document.getElementById('root');
                return root ? root.innerHTML : '';
            });
            
            console.log(`📊 根元素内容长度: ${rootContent.length} 字符`);
            
            if (rootContent.length < 100) {
                console.log('⚠️ 根元素内容过少，可能 React 没有正确渲染');
            }
        } else {
            console.log('❌ 未找到根元素');
        }
        
        // 检查 Molecule 相关元素
        const moleculeElements = await page.$$('[class*="molecule"], [class*="Molecule"], [data-testid*="molecule"]');
        console.log(`🔍 找到 ${moleculeElements.length} 个 Molecule 相关元素`);
        
        // 截图
        await page.screenshot({ path: 'final-diagnosis.png' });
        console.log('📸 截图已保存为 final-diagnosis.png');
        
        // 生成诊断报告
        const report = {
            timestamp: new Date().toISOString(),
            files: files.map(file => ({
                path: file,
                exists: fs.existsSync(file)
            })),
            logs: logs,
            errors: errors,
            moleculeElements: moleculeElements.length,
            pageContentLength: content.length
        };
        
        fs.writeFileSync('diagnosis-report.json', JSON.stringify(report, null, 2));
        console.log('📄 诊断报告已保存为 diagnosis-report.json');
        
    } catch (error) {
        console.error('❌ 诊断过程中出错:', error.message);
        
        // 截图错误状态
        try {
            await page.screenshot({ path: 'diagnosis-error.png' });
            console.log('📸 错误截图已保存为 diagnosis-error.png');
        } catch (screenshotError) {
            console.error('❌ 截图失败:', screenshotError.message);
        }
    } finally {
        await browser.close();
    }
    
    console.log('\n🎯 诊断完成！');
    console.log('请检查以下文件:');
    console.log('- final-diagnosis.png: 页面截图');
    console.log('- diagnosis-report.json: 详细诊断报告');
    console.log('- 浏览器控制台: 查看具体错误信息');
}

finalDiagnosis().catch(console.error);
