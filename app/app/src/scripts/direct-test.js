#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class DirectTest {
    constructor() {
        this.results = [];
    }

    async run() {
        console.log('🎯 直接测试 Hello 插件...\n');
        
        try {
            // 1. 检查服务器状态
            await this.checkServerWithCurl();
            
            // 2. 检查插件文件
            this.checkPluginFiles();
            
            // 3. 检查插件注册
            this.checkPluginRegistration();
            
            // 4. 生成测试报告
            this.generateReport();
            
        } catch (error) {
            console.error('❌ 测试过程中发生错误:', error);
        }
    }

    async checkServerWithCurl() {
        console.log('📡 使用 curl 检查服务器状态...');
        
        return new Promise((resolve) => {
            exec('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/', (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ curl 命令执行失败:', error.message);
                    this.results.push({ step: '服务器状态', status: 'error', message: `curl 失败: ${error.message}` });
                } else {
                    const statusCode = stdout.trim();
                    if (statusCode === '200') {
                        console.log('✅ 服务器运行正常 (HTTP 200)');
                        this.results.push({ step: '服务器状态', status: 'success', message: '服务器运行正常 (HTTP 200)' });
                    } else {
                        console.log(`⚠️ 服务器响应异常 (HTTP ${statusCode})`);
                        this.results.push({ step: '服务器状态', status: 'warning', message: `服务器响应异常 (HTTP ${statusCode})` });
                    }
                }
                resolve();
            });
        });
    }

    checkPluginFiles() {
        console.log('\n📁 检查插件文件...');
        
        const files = [
            'src/plugins/hello/HelloPlugin.ts',
            'src/plugins/hello/manifest.ts',
            'src/core/pluginSystem/ObsidianCompatiblePluginManager.ts',
            'src/core/PluginSystemService.ts'
        ];
        
        files.forEach(file => {
            const filePath = path.join(process.cwd(), file);
            if (fs.existsSync(filePath)) {
                console.log(`✅ ${file} 存在`);
                this.results.push({ step: '插件文件', status: 'success', message: `${file} 存在` });
            } else {
                console.log(`❌ ${file} 不存在`);
                this.results.push({ step: '插件文件', status: 'error', message: `${file} 不存在` });
            }
        });
    }

    checkPluginRegistration() {
        console.log('\n🔍 检查插件注册...');
        
        const pluginServicePath = path.join(process.cwd(), 'src/core/PluginSystemService.ts');
        
        if (fs.existsSync(pluginServicePath)) {
            const content = fs.readFileSync(pluginServicePath, 'utf8');
            
            const checks = [
                {
                    name: 'Hello 插件导入',
                    pattern: /import.*helloPluginManifest/,
                    message: 'Hello 插件已导入'
                },
                {
                    name: 'Hello 插件注册',
                    pattern: /helloPluginManifest/,
                    message: 'Hello 插件已注册'
                }
            ];
            
            checks.forEach(check => {
                if (check.pattern.test(content)) {
                    console.log(`  ✅ ${check.message}`);
                    this.results.push({ step: '插件注册', status: 'success', message: check.message });
                } else {
                    console.log(`  ❌ 缺少: ${check.message}`);
                    this.results.push({ step: '插件注册', status: 'error', message: `缺少: ${check.message}` });
                }
            });
        } else {
            console.log('❌ PluginSystemService.ts 不存在');
            this.results.push({ step: '插件注册', status: 'error', message: 'PluginSystemService.ts 不存在' });
        }
    }

    generateReport() {
        console.log('\n📊 生成测试报告...\n');
        
        const successCount = this.results.filter(r => r.status === 'success').length;
        const errorCount = this.results.filter(r => r.status === 'error').length;
        const warningCount = this.results.filter(r => r.status === 'warning').length;
        
        console.log('📈 测试结果统计:');
        console.log(`  ✅ 成功: ${successCount}`);
        console.log(`  ❌ 错误: ${errorCount}`);
        console.log(`  ⚠️ 警告: ${warningCount}`);
        
        console.log('\n📋 详细结果:');
        this.results.forEach((result, index) => {
            const icon = result.status === 'success' ? '✅' : 
                        result.status === 'error' ? '❌' : '⚠️';
            console.log(`  ${index + 1}. ${icon} [${result.step}] ${result.message}`);
        });
        
        if (errorCount === 0) {
            console.log('\n🎉 所有检查都通过了！');
            console.log('\n🎯 下一步操作:');
            console.log('1. 打开浏览器访问: http://localhost:3000/');
            console.log('2. 按 F12 打开开发者工具');
            console.log('3. 查看控制台输出');
            console.log('4. 检查左侧活动栏是否显示 👋 图标');
            console.log('5. 如果图标不显示，请提供控制台日志');
        } else {
            console.log('\n❌ 发现问题需要修复:');
            const errors = this.results.filter(r => r.status === 'error');
            errors.forEach(error => {
                console.log(`  - ${error.message}`);
            });
        }
        
        console.log('\n💡 调试建议:');
        console.log('1. 确保开发服务器正在运行: npm run dev');
        console.log('2. 检查浏览器控制台是否有错误');
        console.log('3. 确认插件系统已正确初始化');
        console.log('4. 验证 Hello 插件已加载');
    }
}

// 运行测试
const test = new DirectTest();
test.run().catch(console.error);
