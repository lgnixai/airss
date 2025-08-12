const puppeteer = require('puppeteer');

async function detailedUpgradeDiagnosis() {
    console.log('🔍 开始详细升级诊断...');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    
    try {
        // 导航到页面
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('\n📋 1. React 18 特性诊断');
        const react18Status = await page.evaluate(() => {
            return {
                hasReact: typeof window.React !== 'undefined',
                hasReactDOM: typeof window.ReactDOM !== 'undefined',
                hasCreateRoot: typeof window.ReactDOM?.createRoot === 'function',
                hasStartTransition: typeof window.React?.startTransition === 'function',
                hasUseTransition: typeof window.React?.useTransition === 'function',
                hasUseDeferredValue: typeof window.React?.useDeferredValue === 'function',
                reactVersion: window.React?.version,
                reactDOMVersion: window.ReactDOM?.version
            };
        });
        
        console.log('React 18 状态:', JSON.stringify(react18Status, null, 2));
        
        console.log('\n📋 2. Vite 功能诊断');
        const viteStatus = await page.evaluate(() => {
            return {
                hasViteHMR: typeof window.__VITE_HMR_RUNTIME__ !== 'undefined',
                hasViteDevServer: window.location.port === '5173',
                hasViteImportMap: typeof window.__vite_import_map__ !== 'undefined',
                hasViteGlob: typeof window.__vite_glob__ !== 'undefined',
                viteVersion: window.__VITE_HMR_RUNTIME__?.version
            };
        });
        
        console.log('Vite 状态:', JSON.stringify(viteStatus, null, 2));
        
        console.log('\n📋 3. Monaco Editor 诊断');
        const monacoStatus = await page.evaluate(() => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (window.monaco) {
                        resolve({
                            loaded: true,
                            version: window.monaco.version,
                            languages: Object.keys(window.monaco.languages.getLanguages()),
                            hasEditor: typeof window.monaco.editor !== 'undefined',
                            hasLanguages: typeof window.monaco.languages !== 'undefined'
                        });
                    } else {
                        resolve({ 
                            loaded: false,
                            reason: 'window.monaco is undefined'
                        });
                    }
                }, 2000);
            });
        });
        
        console.log('Monaco Editor 状态:', JSON.stringify(monacoStatus, null, 2));
        
        console.log('\n📋 4. 构建输出诊断');
        const fs = require('fs');
        const path = require('path');
        
        const distPath = path.join(__dirname, '../../../dist');
        const hasDistFolder = fs.existsSync(distPath);
        
        console.log(`构建输出目录存在: ${hasDistFolder}`);
        if (hasDistFolder) {
            const files = fs.readdirSync(distPath);
            console.log('构建输出文件:', files);
            
            const requiredFiles = ['index.html', 'assets'];
            const missingFiles = requiredFiles.filter(file => 
                !fs.existsSync(path.join(distPath, file))
            );
            
            console.log(`缺失文件: ${missingFiles.length > 0 ? missingFiles.join(', ') : '无'}`);
        }
        
        console.log('\n📋 5. 控制台日志分析');
        const consoleLogs = await page.evaluate(() => {
            return {
                logs: window.consoleLogs || [],
                errors: window.consoleErrors || [],
                warnings: window.consoleWarnings || []
            };
        });
        
        console.log(`控制台日志数量: ${consoleLogs.logs.length}`);
        console.log(`控制台错误数量: ${consoleLogs.errors.length}`);
        console.log(`控制台警告数量: ${consoleLogs.warnings.length}`);
        
        if (consoleLogs.errors.length > 0) {
            console.log('控制台错误:');
            consoleLogs.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        }
        
        console.log('\n📋 6. 网络请求分析');
        const networkRequests = await page.evaluate(() => {
            return window.networkRequests || [];
        });
        
        console.log(`网络请求数量: ${networkRequests.length}`);
        
        console.log('\n📋 7. 性能指标');
        const performance = await page.evaluate(() => {
            return {
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
                firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime,
                resourceCount: performance.getEntriesByType('resource').length
            };
        });
        
        console.log('性能指标:', JSON.stringify(performance, null, 2));
        
        // 截图
        await page.screenshot({ 
            path: 'test-results/detailed-diagnosis.png', 
            fullPage: true 
        });
        
        console.log('\n🎯 诊断总结:');
        console.log(`✅ React 18: ${react18Status.hasCreateRoot ? '支持' : '不支持'}`);
        console.log(`✅ Vite: ${viteStatus.hasViteHMR ? '支持' : '不支持'}`);
        console.log(`✅ Monaco Editor: ${monacoStatus.loaded ? '已加载' : '未加载'}`);
        console.log(`✅ 构建输出: ${hasDistFolder ? '存在' : '不存在'}`);
        console.log(`✅ 控制台错误: ${consoleLogs.errors.length}个`);
        console.log(`✅ 页面加载时间: ${performance.loadTime}ms`);
        
    } catch (error) {
        console.error('💥 诊断失败:', error);
    } finally {
        await browser.close();
    }
}

detailedUpgradeDiagnosis().catch(console.error);
