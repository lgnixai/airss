#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

class IconDiagnosis {
    constructor() {
        this.serverUrl = 'http://localhost:3000';
        this.results = [];
    }

    async run() {
        console.log('🔍 开始诊断 Hello 插件图标显示问题...\n');
        
        try {
            // 1. 检查服务器状态
            await this.checkServerStatus();
            
            // 2. 检查代码文件
            await this.checkCodeFiles();
            
            // 3. 检查浏览器控制台错误
            await this.checkBrowserErrors();
            
            // 4. 运行 Puppeteer 测试
            await this.runPuppeteerTest();
            
            // 5. 生成诊断报告
            this.generateReport();
            
        } catch (error) {
            console.error('❌ 诊断过程中发生错误:', error);
        }
    }

    async checkServerStatus() {
        console.log('📡 检查服务器状态...');
        
        return new Promise((resolve, reject) => {
            const req = http.get(this.serverUrl, (res) => {
                if (res.statusCode === 200) {
                    console.log('✅ 服务器运行正常 (状态码: 200)');
                    this.results.push({ step: '服务器状态', status: 'success', message: '服务器运行正常' });
                } else {
                    console.log(`⚠️ 服务器响应异常 (状态码: ${res.statusCode})`);
                    this.results.push({ step: '服务器状态', status: 'warning', message: `服务器响应异常 (状态码: ${res.statusCode})` });
                }
                resolve();
            });
            
            req.on('error', (err) => {
                console.log('❌ 无法连接到服务器:', err.message);
                this.results.push({ step: '服务器状态', status: 'error', message: `无法连接到服务器: ${err.message}` });
                resolve();
            });
            
            req.setTimeout(5000, () => {
                console.log('⏰ 服务器连接超时');
                this.results.push({ step: '服务器状态', status: 'error', message: '服务器连接超时' });
                req.destroy();
                resolve();
            });
        });
    }

    async checkCodeFiles() {
        console.log('\n📁 检查代码文件...');
        
        const files = [
            'app/app/src/plugins/hello/HelloPlugin.ts',
            'app/app/src/core/pluginSystem/ObsidianCompatiblePluginManager.ts',
            'app/app/src/extensions/TestExtension.tsx'
        ];
        
        for (const file of files) {
            const filePath = path.join(process.cwd(), file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                
                if (file.includes('HelloPlugin.ts')) {
                    this.checkHelloPluginCode(content);
                } else if (file.includes('ObsidianCompatiblePluginManager.ts')) {
                    this.checkPluginManagerCode(content);
                } else if (file.includes('TestExtension.tsx')) {
                    this.checkTestExtensionCode(content);
                }
                
                console.log(`✅ ${file} 存在`);
                this.results.push({ step: '代码文件检查', status: 'success', message: `${file} 存在` });
            } else {
                console.log(`❌ ${file} 不存在`);
                this.results.push({ step: '代码文件检查', status: 'error', message: `${file} 不存在` });
            }
        }
    }

    checkHelloPluginCode(content) {
        console.log('🔍 检查 HelloPlugin.ts 代码...');
        
        const checks = [
            {
                name: 'Molecule API 调用',
                pattern: /molecule\.activityBar\.add/,
                message: '使用 Molecule API 添加活动栏项目'
            },
            {
                name: 'Hello 插件 ID',
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
            },
            {
                name: '清理逻辑',
                pattern: /activityBar\.remove\(['"]hello-plugin['"]\)/,
                message: '正确的清理逻辑'
            }
        ];
        
        checks.forEach(check => {
            if (check.pattern.test(content)) {
                console.log(`  ✅ ${check.message}`);
                this.results.push({ step: 'HelloPlugin 代码', status: 'success', message: check.message });
            } else {
                console.log(`  ❌ 缺少: ${check.message}`);
                this.results.push({ step: 'HelloPlugin 代码', status: 'error', message: `缺少: ${check.message}` });
            }
        });
    }

    checkPluginManagerCode(content) {
        console.log('🔍 检查 ObsidianCompatiblePluginManager.ts 代码...');
        
        const checks = [
            {
                name: 'React 导入',
                pattern: /import React from ['"]react['"]/,
                message: 'React 导入'
            },
            {
                name: 'addRibbonIcon 方法',
                pattern: /addRibbonIcon/,
                message: 'addRibbonIcon 方法存在'
            },
            {
                name: 'React.createElement 使用',
                pattern: /React\.createElement/,
                message: '使用 React.createElement'
            }
        ];
        
        checks.forEach(check => {
            if (check.pattern.test(content)) {
                console.log(`  ✅ ${check.message}`);
                this.results.push({ step: 'PluginManager 代码', status: 'success', message: check.message });
            } else {
                console.log(`  ❌ 缺少: ${check.message}`);
                this.results.push({ step: 'PluginManager 代码', status: 'error', message: `缺少: ${check.message}` });
            }
        });
    }

    checkTestExtensionCode(content) {
        console.log('🔍 检查 TestExtension.tsx 代码...');
        
        const checks = [
            {
                name: 'testPane 活动栏',
                pattern: /molecule\.activityBar\.add\(\{[^}]*id:\s*['"]testPane['"]/,
                message: 'testPane 活动栏项目'
            },
            {
                name: 'pluginManager 活动栏',
                pattern: /molecule\.activityBar\.add\(\{[^}]*id:\s*['"]pluginManager['"]/,
                message: 'pluginManager 活动栏项目'
            }
        ];
        
        checks.forEach(check => {
            if (check.pattern.test(content)) {
                console.log(`  ✅ ${check.message}`);
                this.results.push({ step: 'TestExtension 代码', status: 'success', message: check.message });
            } else {
                console.log(`  ❌ 缺少: ${check.message}`);
                this.results.push({ step: 'TestExtension 代码', status: 'error', message: `缺少: ${check.message}` });
            }
        });
    }

    async checkBrowserErrors() {
        console.log('\n🌐 检查浏览器控制台错误...');
        
        // 这里可以添加检查浏览器控制台错误的逻辑
        // 由于无法直接访问浏览器控制台，我们提供手动检查指导
        console.log('📋 请手动检查浏览器控制台是否有以下错误:');
        console.log('  1. React 相关错误');
        console.log('  2. JavaScript 语法错误');
        console.log('  3. 插件加载错误');
        console.log('  4. 网络请求错误');
        
        this.results.push({ 
            step: '浏览器错误检查', 
            status: 'info', 
            message: '需要手动检查浏览器控制台错误' 
        });
    }

    async runPuppeteerTest() {
        console.log('\n🤖 运行 Puppeteer 自动化测试...');
        
        const puppeteerTestPath = path.join(process.cwd(), 'app/app/src/tests/puppeteer-plugin-test.ts');
        
        if (fs.existsSync(puppeteerTestPath)) {
            try {
                console.log('🚀 启动 Puppeteer 测试...');
                
                const child = spawn('npx', ['tsx', puppeteerTestPath], {
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
                        if (code === 0) {
                            console.log('✅ Puppeteer 测试完成');
                            this.results.push({ 
                                step: 'Puppeteer 测试', 
                                status: 'success', 
                                message: 'Puppeteer 测试完成' 
                            });
                        } else {
                            console.log(`❌ Puppeteer 测试失败 (退出码: ${code})`);
                            this.results.push({ 
                                step: 'Puppeteer 测试', 
                                status: 'error', 
                                message: `Puppeteer 测试失败 (退出码: ${code})` 
                            });
                        }
                        resolve();
                    });
                    
                    // 设置超时
                    setTimeout(() => {
                        child.kill();
                        console.log('⏰ Puppeteer 测试超时');
                        this.results.push({ 
                            step: 'Puppeteer 测试', 
                            status: 'error', 
                            message: 'Puppeteer 测试超时' 
                        });
                        resolve();
                    }, 30000); // 30秒超时
                });
                
            } catch (error) {
                console.log('❌ 运行 Puppeteer 测试失败:', error.message);
                this.results.push({ 
                    step: 'Puppeteer 测试', 
                    status: 'error', 
                    message: `运行失败: ${error.message}` 
                });
            }
        } else {
            console.log('❌ Puppeteer 测试文件不存在');
            this.results.push({ 
                step: 'Puppeteer 测试', 
                status: 'error', 
                message: 'Puppeteer 测试文件不存在' 
            });
        }
    }

    generateReport() {
        console.log('\n📊 生成诊断报告...\n');
        
        const successCount = this.results.filter(r => r.status === 'success').length;
        const errorCount = this.results.filter(r => r.status === 'error').length;
        const warningCount = this.results.filter(r => r.status === 'warning').length;
        const infoCount = this.results.filter(r => r.status === 'info').length;
        
        console.log('📈 诊断结果统计:');
        console.log(`  ✅ 成功: ${successCount}`);
        console.log(`  ❌ 错误: ${errorCount}`);
        console.log(`  ⚠️ 警告: ${warningCount}`);
        console.log(`  ℹ️ 信息: ${infoCount}`);
        
        console.log('\n📋 详细结果:');
        this.results.forEach((result, index) => {
            const icon = result.status === 'success' ? '✅' : 
                        result.status === 'error' ? '❌' : 
                        result.status === 'warning' ? '⚠️' : 'ℹ️';
            console.log(`  ${index + 1}. ${icon} [${result.step}] ${result.message}`);
        });
        
        console.log('\n🔧 建议的修复步骤:');
        
        const errors = this.results.filter(r => r.status === 'error');
        if (errors.length > 0) {
            console.log('发现以下问题需要修复:');
            errors.forEach(error => {
                console.log(`  - ${error.message}`);
            });
        } else {
            console.log('✅ 没有发现明显的代码问题');
        }
        
        console.log('\n🎯 下一步操作:');
        console.log('1. 刷新浏览器页面 http://localhost:3000/');
        console.log('2. 打开浏览器开发者工具 (F12)');
        console.log('3. 查看控制台是否有错误信息');
        console.log('4. 检查左侧活动栏是否显示 👋 图标');
        console.log('5. 如果图标仍然不显示，请提供控制台错误信息');
        
        // 保存报告到文件
        const reportPath = path.join(process.cwd(), 'icon-diagnosis-report.json');
        fs.writeFileSync(reportPath, JSON.stringify({
            timestamp: new Date().toISOString(),
            results: this.results,
            summary: {
                success: successCount,
                error: errorCount,
                warning: warningCount,
                info: infoCount
            }
        }, null, 2));
        
        console.log(`\n📄 详细报告已保存到: ${reportPath}`);
    }
}

// 运行诊断
const diagnosis = new IconDiagnosis();
diagnosis.run().catch(console.error);
