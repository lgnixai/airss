#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class FinalIconVerification {
    constructor() {
        this.results = [];
    }

    async run() {
        console.log('🎯 最终图标验证测试...\n');
        
        try {
            // 1. 检查代码完整性
            this.checkCodeCompleteness();
            
            // 2. 运行浏览器自动化测试
            await this.runBrowserTest();
            
            // 3. 生成最终报告
            this.generateFinalReport();
            
        } catch (error) {
            console.error('❌ 验证过程中发生错误:', error);
        }
    }

    checkCodeCompleteness() {
        console.log('📁 检查代码完整性...');
        
        const helloPluginPath = path.join(process.cwd(), 'src/plugins/hello/HelloPlugin.ts');
        
        if (fs.existsSync(helloPluginPath)) {
            const content = fs.readFileSync(helloPluginPath, 'utf8');
            
            // 检查关键代码片段
            const checks = [
                {
                    name: 'Molecule API 调用',
                    pattern: /this\.app\.molecule\.activityBar\.add\(\{[\s\S]*?id:\s*['"]hello-plugin['"][\s\S]*?\}\)/,
                    message: '完整的 Molecule API 调用'
                },
                {
                    name: '正确的参数',
                    pattern: /id:\s*['"]hello-plugin['"][\s\S]*?name:\s*['"]Hello Plugin['"][\s\S]*?icon:\s*['"]👋['"][\s\S]*?sortIndex:\s*4/,
                    message: '正确的 API 参数'
                },
                {
                    name: 'onClick 处理',
                    pattern: /onClick:\s*\(\)\s*=>\s*\{[\s\S]*?this\.showHelloWorld\(\)[\s\S]*?\}/,
                    message: '正确的点击事件处理'
                },
                {
                    name: '清理逻辑',
                    pattern: /this\.app\.molecule\.activityBar\.remove\(['"]hello-plugin['"]\)/,
                    message: '正确的清理逻辑'
                }
            ];
            
            checks.forEach(check => {
                if (check.pattern.test(content)) {
                    console.log(`  ✅ ${check.message}`);
                    this.results.push({ step: '代码完整性', status: 'success', message: check.message });
                } else {
                    console.log(`  ❌ 缺少: ${check.message}`);
                    this.results.push({ step: '代码完整性', status: 'error', message: `缺少: ${check.message}` });
                }
            });
        } else {
            console.log('❌ HelloPlugin.ts 文件不存在');
            this.results.push({ step: '代码完整性', status: 'error', message: 'HelloPlugin.ts 文件不存在' });
        }
    }

    async runBrowserTest() {
        console.log('\n🌐 运行浏览器自动化测试...');
        
        // 创建一个简单的 Puppeteer 测试脚本
        const testScript = `
const puppeteer = require('puppeteer');

async function testHelloIcon() {
    console.log('🤖 开始 Hello 图标验证测试...');
    
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
            console.log('📝 控制台消息 [' + msg.type() + ']:', msg.text());
        });
        
        // 导航到应用
        console.log('🌐 导航到应用...');
        await page.goto('http://localhost:5173/', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        // 等待页面加载
        console.log('⏳ 等待页面加载...');
        await page.waitForTimeout(5000);
        
        // 检查 Hello 插件日志
        console.log('🔍 检查 Hello 插件日志...');
        const logs = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('script')).map(script => script.textContent).join(' ');
        });
        
        // 检查活动栏元素
        console.log('🔍 检查活动栏元素...');
        const activityBarItems = await page.evaluate(() => {
            const activityBar = document.querySelector('[data-testid="activity-bar"]') || 
                               document.querySelector('.activity-bar') ||
                               document.querySelector('[class*="activity"]');
            
            if (!activityBar) {
                return { found: false, items: [], message: '未找到活动栏元素' };
            }
            
            const items = Array.from(activityBar.querySelectorAll('[data-testid*="activity"], [class*="activity"], button, div'))
                .map(item => ({
                    id: item.getAttribute('data-testid') || item.getAttribute('id') || item.className,
                    text: item.textContent || item.innerText || '',
                    title: item.getAttribute('title') || '',
                    visible: item.offsetWidth > 0 && item.offsetHeight > 0
                }))
                .filter(item => item.visible);
            
            return { found: true, items, message: '找到活动栏元素' };
        });
        
        console.log('📊 活动栏检查结果:', activityBarItems);
        
        // 检查是否有 Hello 相关的元素
        const hasHelloIcon = activityBarItems.items.some(item => 
            item.text.includes('👋') || 
            item.title.includes('Hello') || 
            item.id.includes('hello')
        );
        
        if (hasHelloIcon) {
            console.log('✅ 找到 Hello 图标！');
            return { success: true, message: 'Hello 图标已显示' };
        } else {
            console.log('❌ 未找到 Hello 图标');
            console.log('📋 当前活动栏项目:', activityBarItems.items);
            return { success: false, message: '未找到 Hello 图标', items: activityBarItems.items };
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
        
        const testFilePath = path.join(process.cwd(), 'temp-icon-test.js');
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

    generateFinalReport() {
        console.log('\n📊 生成最终验证报告...\n');
        
        const successCount = this.results.filter(r => r.status === 'success').length;
        const errorCount = this.results.filter(r => r.status === 'error').length;
        
        console.log('📈 验证结果统计:');
        console.log(`  ✅ 成功: ${successCount}`);
        console.log(`  ❌ 错误: ${errorCount}`);
        
        console.log('\n📋 详细结果:');
        this.results.forEach((result, index) => {
            const icon = result.status === 'success' ? '✅' : '❌';
            console.log(`  ${index + 1}. ${icon} [${result.step}] ${result.message}`);
        });
        
        if (errorCount === 0) {
            console.log('\n🎉 所有验证都通过了！Hello 插件应该正常工作。');
            console.log('\n🎯 如果图标仍然不显示，可能的原因:');
            console.log('1. 浏览器缓存问题 - 请强制刷新 (Ctrl+F5)');
            console.log('2. 插件加载时机问题 - 请等待页面完全加载');
            console.log('3. CSS 样式问题 - 图标可能被隐藏');
            console.log('4. 浏览器兼容性问题 - 尝试不同浏览器');
        } else {
            console.log('\n❌ 发现问题需要修复:');
            const errors = this.results.filter(r => r.status === 'error');
            errors.forEach(error => {
                console.log(`  - ${error.message}`);
            });
        }
        
        console.log('\n💡 最终建议:');
        console.log('1. 打开浏览器访问: http://localhost:5173/');
        console.log('2. 按 F12 打开开发者工具');
        console.log('3. 在控制台输入: console.log("Hello Plugin Test")');
        console.log('4. 检查左侧活动栏');
        console.log('5. 如果问题持续，请提供完整的控制台日志');
    }
}

// 运行验证
const verification = new FinalIconVerification();
verification.run().catch(console.error);
