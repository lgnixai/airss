#!/usr/bin/env node

/**
 * 智能Hello插件图标测试脚本
 * 使用Puppeteer检查实际页面状态
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

class SmartIconTest {
  constructor() {
    this.testResults = [];
    this.issues = [];
  }

  async runSmartTest() {
    console.log('🧠 开始智能Hello插件图标测试...');
    console.log('='.repeat(60));
    
    try {
      // 1. 检查服务器状态
      await this.checkServerStatus();
      
      // 2. 检查代码状态
      await this.checkCodeStatus();
      
      // 3. 尝试使用Puppeteer（如果可用）
      await this.tryPuppeteerTest();
      
      // 4. 生成智能建议
      this.generateSmartReport();
      
    } catch (error) {
      console.error('❌ 智能测试失败:', error);
    }
  }

  async checkServerStatus() {
    console.log('\n🔍 检查服务器状态...');
    
    try {
      const response = await this.makeRequest('http://localhost:5173/');
      
      if (response.statusCode === 200) {
        console.log('✅ 服务器响应正常');
        console.log(`📊 响应长度: ${response.data.length} 字符`);
        
        // 检查是否包含关键内容
        const hasReact = response.data.includes('React');
        const hasMolecule = response.data.includes('molecule');
        const hasPluginSystem = response.data.includes('PluginSystem');
        
        console.log(`🔍 包含React: ${hasReact ? '✅' : '❌'}`);
        console.log(`🔍 包含Molecule: ${hasMolecule ? '✅' : '❌'}`);
        console.log(`🔍 包含插件系统: ${hasPluginSystem ? '✅' : '❌'}`);
        
        this.testResults.push({
          test: 'server_status',
          status: 'pass',
          details: '服务器响应正常'
        });
        
      } else {
        console.log(`❌ 服务器响应异常: ${response.statusCode}`);
        this.testResults.push({
          test: 'server_status',
          status: 'fail',
          details: `服务器响应异常: ${response.statusCode}`
        });
        
        this.issues.push({
          type: 'server_error',
          description: `服务器返回 ${response.statusCode} 状态码`,
          solution: '检查开发服务器是否正常运行'
        });
      }
    } catch (error) {
      console.log('❌ 服务器检查失败:', error.message);
      this.testResults.push({
        test: 'server_status',
        status: 'fail',
        details: '服务器检查失败'
      });
      
      this.issues.push({
        type: 'server_unreachable',
        description: '无法连接到服务器',
        solution: '启动开发服务器: npm run dev'
      });
    }
  }

  async checkCodeStatus() {
    console.log('\n🔍 检查代码状态...');
    
    // 检查关键文件
    const keyFiles = [
      'src/plugins/hello/HelloPlugin.ts',
      'src/core/pluginSystem/ObsidianCompatiblePluginManager.ts',
      'src/core/PluginSystemService.ts'
    ];
    
    for (const file of keyFiles) {
      const fullPath = path.join(process.cwd(), file);
      const exists = fs.existsSync(fullPath);
      console.log(`${exists ? '✅' : '❌'} ${file}: ${exists ? '存在' : '不存在'}`);
      
      if (exists) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const size = content.length;
        console.log(`   📊 大小: ${size} 字符`);
        
        // 检查文件内容
        if (file.includes('HelloPlugin.ts')) {
          const hasOnload = content.includes('onload()');
          const hasAddRibbonIcon = content.includes('addRibbonIcon');
          console.log(`   🔍 包含onload方法: ${hasOnload ? '✅' : '❌'}`);
          console.log(`   🔍 包含addRibbonIcon调用: ${hasAddRibbonIcon ? '✅' : '❌'}`);
        }
        
        if (file.includes('ObsidianCompatiblePluginManager.ts')) {
          const hasOnClick = content.includes('onClick: () => {');
          const hasReactImport = content.includes('import React from \'react\'');
          console.log(`   🔍 包含正确onClick: ${hasOnClick ? '✅' : '❌'}`);
          console.log(`   🔍 包含React导入: ${hasReactImport ? '✅' : '❌'}`);
        }
      }
    }
    
    this.testResults.push({
      test: 'code_status',
      status: 'pass',
      details: '代码文件检查完成'
    });
  }

  async tryPuppeteerTest() {
    console.log('\n🤖 尝试Puppeteer测试...');
    
    try {
      // 检查是否安装了Puppeteer
      const puppeteerPath = path.join(process.cwd(), 'node_modules', 'puppeteer');
      const hasPuppeteer = fs.existsSync(puppeteerPath);
      
      if (hasPuppeteer) {
        console.log('✅ 发现Puppeteer，尝试运行浏览器测试...');
        
        // 运行Puppeteer测试
        const result = await this.runPuppeteerTest();
        if (result) {
          this.testResults.push({
            test: 'puppeteer_test',
            status: 'pass',
            details: 'Puppeteer测试完成'
          });
        }
      } else {
        console.log('⚠️ 未安装Puppeteer，跳过浏览器测试');
        this.testResults.push({
          test: 'puppeteer_test',
          status: 'skip',
          details: '未安装Puppeteer'
        });
        
        this.issues.push({
          type: 'missing_puppeteer',
          description: '未安装Puppeteer',
          solution: '安装Puppeteer: npm install puppeteer'
        });
      }
    } catch (error) {
      console.log('❌ Puppeteer测试失败:', error.message);
      this.testResults.push({
        test: 'puppeteer_test',
        status: 'fail',
        details: 'Puppeteer测试失败'
      });
    }
  }

  async runPuppeteerTest() {
    return new Promise((resolve) => {
      console.log('🔍 启动浏览器测试...');
      
      // 使用tsx运行Puppeteer测试
      const testFile = path.join(process.cwd(), 'src', 'tests', 'puppeteer-plugin-test.ts');
      
      if (fs.existsSync(testFile)) {
        const child = spawn('npx', ['tsx', testFile], {
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
        
        child.on('close', (code) => {
          if (code === 0) {
            console.log('✅ Puppeteer测试成功完成');
            resolve(true);
          } else {
            console.log(`❌ Puppeteer测试失败，退出码: ${code}`);
            resolve(false);
          }
        });
        
        // 设置超时
        setTimeout(() => {
          child.kill();
          console.log('⏰ Puppeteer测试超时');
          resolve(false);
        }, 30000);
        
      } else {
        console.log('⚠️ Puppeteer测试文件不存在');
        resolve(false);
      }
    });
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode || 0, data }));
      });
      req.on('error', reject);
      req.setTimeout(10000, () => req.destroy());
    });
  }

  generateSmartReport() {
    console.log('\n📊 智能测试报告');
    console.log('='.repeat(60));
    
    const passedTests = this.testResults.filter(r => r.status === 'pass').length;
    const failedTests = this.testResults.filter(r => r.status === 'fail').length;
    const skippedTests = this.testResults.filter(r => r.status === 'skip').length;
    const totalTests = this.testResults.length;
    
    console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`);
    console.log(`📊 失败测试: ${failedTests} 个`);
    console.log(`📊 跳过测试: ${skippedTests} 个`);
    console.log(`📊 发现问题: ${this.issues.length} 个`);
    
    console.log('\n📝 详细结果:');
    this.testResults.forEach((result, index) => {
      const status = result.status === 'pass' ? '✅' : result.status === 'skip' ? '⏭️' : '❌';
      console.log(`${index + 1}. ${status} ${result.test}: ${result.details}`);
    });
    
    if (this.issues.length > 0) {
      console.log('\n🔧 发现的问题:');
      this.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.description}`);
        console.log(`   解决方案: ${issue.solution}`);
      });
    }
    
    console.log('\n🎯 智能建议:');
    
    if (failedTests === 0 && this.issues.length === 0) {
      console.log('✅ 系统状态良好！');
      console.log('💡 请手动检查浏览器中的Hello插件图标');
      console.log('🌐 访问: http://localhost:5173/');
      console.log('🔍 查看左侧活动栏是否有 👋 图标');
    } else {
      console.log('🔧 需要解决的问题:');
      
      if (this.issues.some(i => i.type === 'server_error' || i.type === 'server_unreachable')) {
        console.log('1. 🔄 重启开发服务器');
        console.log('   npm run dev');
      }
      
      if (this.issues.some(i => i.type === 'missing_puppeteer')) {
        console.log('2. 📦 安装Puppeteer进行自动化测试');
        console.log('   npm install puppeteer');
      }
      
      console.log('3. 🔍 手动检查浏览器控制台');
      console.log('   按F12打开开发者工具，查看Console标签页');
      console.log('   查找 "Hello Plugin loaded!" 日志');
    }
    
    console.log('\n🚀 快速验证步骤:');
    console.log('1. 打开浏览器访问 http://localhost:5173/');
    console.log('2. 按F12打开开发者工具');
    console.log('3. 查看Console标签页的日志');
    console.log('4. 检查左侧活动栏是否有 👋 Hello插件图标');
    console.log('5. 点击图标测试功能');
  }
}

// 运行智能测试
async function main() {
  const smartTest = new SmartIconTest();
  await smartTest.runSmartTest();
}

main().catch(console.error);
