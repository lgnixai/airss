#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

class SimpleIconTest {
    constructor() {
        this.serverUrl = 'http://localhost:5173';
    }

    async run() {
        console.log('🔍 简单图标测试...\n');
        
        try {
            // 1. 检查服务器状态
            await this.checkServer();
            
            // 2. 检查代码
            this.checkCode();
            
            // 3. 提供手动测试指导
            this.provideManualTestGuide();
            
        } catch (error) {
            console.error('❌ 测试过程中发生错误:', error);
        }
    }

    async checkServer() {
        console.log('📡 检查服务器状态...');
        
        return new Promise((resolve) => {
            const req = http.get(this.serverUrl, (res) => {
                if (res.statusCode === 200) {
                    console.log('✅ 服务器运行正常');
                } else {
                    console.log(`⚠️ 服务器响应异常 (状态码: ${res.statusCode})`);
                }
                resolve();
            });
            
            req.on('error', (err) => {
                console.log('❌ 无法连接到服务器:', err.message);
                resolve();
            });
            
            req.setTimeout(5000, () => {
                console.log('⏰ 服务器连接超时');
                req.destroy();
                resolve();
            });
        });
    }

    checkCode() {
        console.log('\n📁 检查关键代码...');
        
        const helloPluginPath = path.join(process.cwd(), 'src/plugins/hello/HelloPlugin.ts');
        
        if (fs.existsSync(helloPluginPath)) {
            const content = fs.readFileSync(helloPluginPath, 'utf8');
            
            // 检查关键代码模式
            const checks = [
                {
                    name: 'Molecule API 调用',
                    pattern: /this\.app\.molecule\.activityBar\.add/,
                    message: '使用 Molecule API 添加活动栏项目'
                },
                {
                    name: '正确的 ID',
                    pattern: /id:\s*['"]hello-plugin['"]/,
                    message: '正确的插件 ID'
                },
                {
                    name: 'Hello 图标',
                    pattern: /icon:\s*['"]👋['"]/,
                    message: 'Hello 图标设置'
                },
                {
                    name: 'onClick 处理',
                    pattern: /onClick:\s*\(\)\s*=>/,
                    message: '点击事件处理'
                }
            ];
            
            let allPassed = true;
            checks.forEach(check => {
                if (check.pattern.test(content)) {
                    console.log(`  ✅ ${check.message}`);
                } else {
                    console.log(`  ❌ 缺少: ${check.message}`);
                    allPassed = false;
                }
            });
            
            if (allPassed) {
                console.log('\n✅ 代码检查通过！Hello 插件代码看起来正确。');
            } else {
                console.log('\n❌ 代码检查失败！需要修复上述问题。');
            }
        } else {
            console.log('❌ HelloPlugin.ts 文件不存在');
        }
    }

    provideManualTestGuide() {
        console.log('\n🎯 手动测试指导:');
        console.log('1. 打开浏览器访问: http://localhost:5173/');
        console.log('2. 按 F12 打开开发者工具');
        console.log('3. 切换到 Console 标签页');
        console.log('4. 刷新页面');
        console.log('5. 查看控制台输出，应该看到:');
        console.log('   - "Hello Plugin loaded!"');
        console.log('   - "Hello Plugin: Using Molecule API to add activity bar item"');
        console.log('   - "Hello Plugin: Activity bar item added via Molecule API"');
        console.log('6. 查看左侧活动栏，应该看到 👋 图标');
        console.log('7. 点击 👋 图标，应该显示 Hello World');
        
        console.log('\n🔍 如果图标不显示，请检查:');
        console.log('1. 控制台是否有错误信息');
        console.log('2. 网络标签页是否有失败的请求');
        console.log('3. 元素标签页中是否有活动栏元素');
        
        console.log('\n📋 请提供以下信息:');
        console.log('1. 控制台是否显示了 Hello Plugin 的加载日志？');
        console.log('2. 控制台是否有任何错误信息？');
        console.log('3. 左侧活动栏显示了哪些图标？');
        console.log('4. 是否能看到 testPane 和 pluginManager 图标？');
    }
}

// 运行测试
const test = new SimpleIconTest();
test.run().catch(console.error);
