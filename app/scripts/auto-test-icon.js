#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutoTestIcon {
    constructor() {
        this.results = [];
    }

    async run() {
        console.log('🤖 自动化测试 Hello 插件图标...\n');
        
        try {
            // 1. 检查代码修复
            this.checkCodeFix();
            
            // 2. 运行浏览器自动化测试
            await this.runBrowserTest();
            
            // 3. 生成测试报告
            this.generateReport();
            
        } catch (error) {
            console.error('❌ 测试过程中发生错误:', error);
        }
    }

    checkCodeFix() {
        console.log('📁 检查代码修复状态...');
        
        const helloPluginPath = path.join(process.cwd(), 'src/plugins/hello/HelloPlugin.ts');
        
        if (fs.existsSync(helloPluginPath)) {
            const content = fs.readFileSync(helloPluginPath, 'utf8');
            
            // 检查关键修复点
            const checks = [
                {
                    name: '插件 API 调用',
                    pattern: /this\.app\.api\.ui\.addActivityBarItem/,
                    message: '使用插件 API 添加活动栏项目'
                },
                {
                    name: '正确的图标',
                    pattern: /icon:\s*['"]lightbulb['"]/,
                    message: '使用 lightbulb 图标'
                },
                {
                    name: '正确的 ID',
                    pattern: /id:\s*['"]hello-plugin['"]/,
                    message: '正确的插件 ID'
                },
                {
                    name: 'onClick 处理',
                    pattern: /onClick:\s*\(\)\s*=>/,
                    message: '点击事件处理'
                }
            ];
            
            checks.forEach(check => {
                if (check.pattern.test(content)) {
                    console.log(`  ✅ ${check.message}`);
                    this.results.push({ step: '代码检查', status: 'success', message: check.message });
                } else {
                    console.log(`  ❌ 缺少: ${check.message}`);
                    this.results.push({ step: '代码检查', status: 'error', message: `缺少: ${check.message}` });
                }
            });
        } else {
            console.log('❌ HelloPlugin.ts 文件不存在');
            this.results.push({ step: '代码检查', status: 'error', message: 'HelloPlugin.ts 文件不存在' });
        }
    }

    async runBrowserTest() {
        console.log('\n🌐 运行浏览器自动化测试...');
        
        // 创建一个简化的 Puppeteer 测试脚本
        const testScript = `
const puppeteer = require('puppeteer');

async function testHelloIcon() {
    console.log('🚀 开始 Hello 图标自动化测试...');
    
    let browser;
    try {
        // 启动浏览器
        browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // 设置控制台监听
        page.on('console', msg => {
            const text = msg.text();
            if (text.includes('Hello Plugin') || text.includes('lightbulb')) {
                console.log('📝 相关控制台消息:', text);
            }
        });
        
        // 导航到应用
        console.log('🌐 导航到应用...');
        await page.goto('http://localhost:5173/', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        // 等待页面加载
        console.log('⏳ 等待页面加载...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 检查 Hello 插件日志
        console.log('🔍 检查 Hello 插件日志...');
        const logs = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('script')).map(script => script.textContent).join(' ');
        });
        
        // 检查活动栏元素
        console.log('🔍 检查活动栏元素...');
        const activityBarResult = await page.evaluate(() => {
            // 尝试多种选择器找到活动栏
            const selectors = [
                '[data-testid="activity-bar"]',
                '.activity-bar',
                '[class*="activity"]',
                '[class*="ActivityBar"]',
                '.mo-activityBar__container',
                'section[class*="activity"]',
                'nav[class*="activity"]'
            ];
            
            let activityBar = null;
            for (const selector of selectors) {
                activityBar = document.querySelector(selector);
                if (activityBar) {
                    console.log('找到活动栏:', selector);
                    break;
                }
            }
            
            if (!activityBar) {
                return { found: false, items: [], message: '未找到活动栏元素' };
            }
            
            // 查找所有可能的图标元素
            const items = Array.from(activityBar.querySelectorAll('*'))
                .filter(item => {
                    // 过滤出可能是图标的元素
                    const hasIcon = item.textContent.includes('💡') || 
                                   item.textContent.includes('lightbulb') ||
                                   item.textContent.includes('Hello') ||
                                   item.getAttribute('title')?.includes('Hello') ||
                                   item.getAttribute('data-testid')?.includes('hello') ||
                                   item.className?.includes('hello');
                    
                    const isVisible = item.offsetWidth > 0 && item.offsetHeight > 0;
                    const isClickable = item.onclick || item.getAttribute('onclick');
                    
                    return hasIcon || (isVisible && isClickable);
                })
                .map(item => ({
                    id: item.getAttribute('data-testid') || item.getAttribute('id') || item.className,
                    text: item.textContent || item.innerText || '',
                    title: item.getAttribute('title') || '',
                    visible: item.offsetWidth > 0 && item.offsetHeight > 0,
                    hasHello: item.textContent.includes('Hello') || 
                             item.getAttribute('title')?.includes('Hello') ||
                             item.getAttribute('data-testid')?.includes('hello')
                }));
            
            return { found: true, items, message: '找到活动栏元素' };
        });
        
        console.log('📊 活动栏检查结果:', activityBarResult);
        
        // 检查是否有 Hello 相关的元素
        const hasHelloIcon = activityBarResult.items.some(item => 
            item.hasHello || 
            item.text.includes('💡') || 
            item.title.includes('Hello')
        );
        
        if (hasHelloIcon) {
            console.log('✅ 找到 Hello 图标！');
            return { success: true, message: 'Hello 图标已显示', items: activityBarResult.items };
        } else {
            console.log('❌ 未找到 Hello 图标');
            console.log('📋 当前活动栏项目:', activityBarResult.items);
            return { success: false, message: '未找到 Hello 图标', items: activityBarResult.items };
        }
        
    } catch (error) {
        console.error('❌ 测试过程中发生错误:', error.message);
        return { success: false, message: '测试失败: ' + error.message };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

testHelloIcon().then(result => {
    console.log('📊 测试结果:', result);
    process.exit(result.success ? 0 : 1);
}).catch(error => {
    console.error('❌ 测试失败:', error);
    process.exit(1);
});
`;
        
        const testFilePath = path.join(process.cwd(), 'temp-hello-test.js');
        fs.writeFileSync(testFilePath, testScript);
        
        try {
            console.log('🚀 启动 Puppeteer 测试...');
            
            const child = spawn('node', [testFilePath], {
                stdio: 'pipe',
                cwd: process.cwd()
            });
            
            let output = '';
            let errorOutput = '';
            
            child.stdout.on('data', (data) => {
                output += data.toString();
                console.log(data.toString());
            });
            
            child.stderr.on('data', (data) => {
                errorOutput += data.toString();
                console.error(data.toString());
            });
            
            return new Promise((resolve) => {
                child.on('close', (code) => {
                    // 清理临时文件
                    try {
                        fs.unlinkSync(testFilePath);
                    } catch (e) {
                        // 忽略清理错误
                    }
                    
                    if (code === 0) {
                        console.log('✅ Puppeteer 测试成功');
                        this.results.push({ 
                            step: '浏览器测试', 
                            status: 'success', 
                            message: 'Hello 图标验证成功' 
                        });
                    } else {
                        console.log(`❌ Puppeteer 测试失败 (退出码: ${code})`);
                        this.results.push({ 
                            step: '浏览器测试', 
                            status: 'error', 
                            message: 'Hello 图标验证失败' 
                        });
                    }
                    resolve();
                });
                
                // 设置超时
                setTimeout(() => {
                    child.kill();
                    console.log('⏰ Puppeteer 测试超时');
                    this.results.push({ 
                        step: '浏览器测试', 
                        status: 'error', 
                        message: 'Puppeteer 测试超时' 
                    });
                    resolve();
                }, 60000); // 60秒超时
            });
            
        } catch (error) {
            console.log('❌ 运行 Puppeteer 测试失败:', error.message);
            this.results.push({ 
                step: '浏览器测试', 
                status: 'error', 
                message: `运行失败: ${error.message}` 
            });
        }
    }

    generateReport() {
        console.log('\n📊 生成自动化测试报告...\n');
        
        const successCount = this.results.filter(r => r.status === 'success').length;
        const errorCount = this.results.filter(r => r.status === 'error').length;
        
        console.log('📈 测试结果统计:');
        console.log(`  ✅ 成功: ${successCount}`);
        console.log(`  ❌ 错误: ${errorCount}`);
        
        console.log('\n📋 详细结果:');
        this.results.forEach((result, index) => {
            const icon = result.status === 'success' ? '✅' : '❌';
            console.log(`  ${index + 1}. ${icon} [${result.step}] ${result.message}`);
        });
        
        if (errorCount === 0) {
            console.log('\n🎉 自动化测试通过！Hello 插件图标应该已经正确显示。');
            console.log('\n🎯 测试结果:');
            console.log('1. ✅ 代码修复正确');
            console.log('2. ✅ 浏览器测试通过');
            console.log('3. ✅ Hello 图标已显示');
            
            console.log('\n🔍 如果图标仍然不显示，可能的原因:');
            console.log('1. 浏览器缓存 - 请强制刷新 (Ctrl+F5)');
            console.log('2. 插件加载延迟 - 请等待 5-10 秒');
            console.log('3. CSS 样式问题 - 图标可能被隐藏');
        } else {
            console.log('\n❌ 自动化测试失败，发现问题:');
            const errors = this.results.filter(r => r.status === 'error');
            errors.forEach(error => {
                console.log(`  - ${error.message}`);
            });
            
            console.log('\n🔧 建议的修复步骤:');
            console.log('1. 检查 Hello 插件代码是否正确');
            console.log('2. 确认插件系统已正确初始化');
            console.log('3. 查看浏览器控制台错误');
        }
        
        console.log('\n💡 手动验证步骤:');
        console.log('1. 打开浏览器: http://localhost:5173/');
        console.log('2. 按 F12 打开开发者工具');
        console.log('3. 查看控制台是否显示 Hello 插件日志');
        console.log('4. 检查左侧活动栏是否显示 💡 图标');
        console.log('5. 点击图标测试功能');
    }
}

// 运行自动化测试
const test = new AutoTestIcon();
test.run().catch(console.error);
