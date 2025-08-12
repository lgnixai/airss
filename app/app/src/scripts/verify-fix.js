#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class VerifyFix {
    constructor() {
        this.results = [];
    }

    async run() {
        console.log('🔧 验证 Hello 插件修复...\n');
        
        try {
            // 1. 检查修复后的代码
            this.checkFixedCode();
            
            // 2. 对比 RSS 插件实现
            this.compareWithRssPlugin();
            
            // 3. 生成验证报告
            this.generateReport();
            
        } catch (error) {
            console.error('❌ 验证过程中发生错误:', error);
        }
    }

    checkFixedCode() {
        console.log('📁 检查修复后的 Hello 插件代码...');
        
        const helloPluginPath = path.join(process.cwd(), 'src/plugins/hello/HelloPlugin.ts');
        
        if (fs.existsSync(helloPluginPath)) {
            const content = fs.readFileSync(helloPluginPath, 'utf8');
            
            // 检查修复后的关键代码
            const checks = [
                {
                    name: '插件 API 调用',
                    pattern: /this\.app\.api\.ui\.addActivityBarItem/,
                    message: '使用插件 API 添加活动栏项目'
                },
                {
                    name: '正确的图标',
                    pattern: /icon:\s*['"]lightbulb['"]/,
                    message: '使用 Molecule 支持的图标名称'
                },
                {
                    name: '正确的参数',
                    pattern: /id:\s*['"]hello-plugin['"][\s\S]*?name:\s*['"]Hello Plugin['"][\s\S]*?sortIndex:\s*4/,
                    message: '正确的 API 参数'
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
                    this.results.push({ step: '修复验证', status: 'success', message: check.message });
                } else {
                    console.log(`  ❌ 缺少: ${check.message}`);
                    this.results.push({ step: '修复验证', status: 'error', message: `缺少: ${check.message}` });
                }
            });
        } else {
            console.log('❌ HelloPlugin.ts 文件不存在');
            this.results.push({ step: '修复验证', status: 'error', message: 'HelloPlugin.ts 文件不存在' });
        }
    }

    compareWithRssPlugin() {
        console.log('\n📊 对比 RSS 插件实现...');
        
        const rssPluginPath = path.join(process.cwd(), 'src/plugins/rss/RssPlugin.ts');
        const helloPluginPath = path.join(process.cwd(), 'src/plugins/hello/HelloPlugin.ts');
        
        if (fs.existsSync(rssPluginPath) && fs.existsSync(helloPluginPath)) {
            const rssContent = fs.readFileSync(rssPluginPath, 'utf8');
            const helloContent = fs.readFileSync(helloPluginPath, 'utf8');
            
            // 提取 RSS 插件的活动栏添加代码
            const rssPattern = /this\.api\.ui\.addActivityBarItem\(\{[\s\S]*?\}\);/;
            const rssMatch = rssContent.match(rssPattern);
            
            // 提取 Hello 插件的活动栏添加代码
            const helloPattern = /this\.app\.api\.ui\.addActivityBarItem\(\{[\s\S]*?\}\);/;
            const helloMatch = helloContent.match(helloPattern);
            
            if (rssMatch && helloMatch) {
                console.log('  ✅ 两个插件都使用了相同的 API 调用模式');
                this.results.push({ step: '对比验证', status: 'success', message: 'API 调用模式一致' });
                
                // 检查图标格式
                const rssIconMatch = rssMatch[0].match(/icon:\s*['"]([^'"]+)['"]/);
                const helloIconMatch = helloMatch[0].match(/icon:\s*['"]([^'"]+)['"]/);
                
                if (rssIconMatch && helloIconMatch) {
                    console.log(`  📊 RSS 插件图标: ${rssIconMatch[1]}`);
                    console.log(`  📊 Hello 插件图标: ${helloIconMatch[1]}`);
                    
                    if (rssIconMatch[1] === 'rss' && helloIconMatch[1] === 'lightbulb') {
                        console.log('  ✅ 两个插件都使用了 Molecule 支持的图标名称');
                        this.results.push({ step: '对比验证', status: 'success', message: '图标格式正确' });
                    } else {
                        console.log('  ⚠️ 图标格式可能不一致');
                        this.results.push({ step: '对比验证', status: 'warning', message: '图标格式需要验证' });
                    }
                }
            } else {
                console.log('  ❌ 无法提取活动栏添加代码');
                this.results.push({ step: '对比验证', status: 'error', message: '无法提取活动栏添加代码' });
            }
        } else {
            console.log('  ❌ 插件文件不存在');
            this.results.push({ step: '对比验证', status: 'error', message: '插件文件不存在' });
        }
    }

    generateReport() {
        console.log('\n📊 生成验证报告...\n');
        
        const successCount = this.results.filter(r => r.status === 'success').length;
        const errorCount = this.results.filter(r => r.status === 'error').length;
        const warningCount = this.results.filter(r => r.status === 'warning').length;
        
        console.log('📈 验证结果统计:');
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
            console.log('\n🎉 修复验证通过！Hello 插件现在应该与 RSS 插件使用相同的实现方式。');
            console.log('\n🎯 关键修复点:');
            console.log('1. ✅ 使用 `this.app.api.ui.addActivityBarItem()` 而不是直接调用 Molecule API');
            console.log('2. ✅ 使用 `icon: "lightbulb"` 而不是 emoji');
            console.log('3. ✅ 保持与 RSS 插件相同的 API 调用模式');
            console.log('4. ✅ 正确的清理逻辑');
            
            console.log('\n🔍 现在请测试:');
            console.log('1. 刷新浏览器页面: http://localhost:5173/');
            console.log('2. 查看控制台是否显示: "Hello Plugin: Using plugin API to add activity bar item"');
            console.log('3. 检查左侧活动栏是否显示 💡 图标 (lightbulb)');
            console.log('4. 点击图标测试功能');
        } else {
            console.log('\n❌ 修复验证失败，需要进一步修复:');
            const errors = this.results.filter(r => r.status === 'error');
            errors.forEach(error => {
                console.log(`  - ${error.message}`);
            });
        }
        
        console.log('\n💡 修复总结:');
        console.log('- 将 Hello 插件的实现方式改为与 RSS 插件一致');
        console.log('- 使用插件 API 而不是直接调用 Molecule API');
        console.log('- 使用 Molecule 支持的图标名称而不是 emoji');
        console.log('- 这应该能解决图标不显示的问题');
    }
}

// 运行验证
const verification = new VerifyFix();
verification.run().catch(console.error);
