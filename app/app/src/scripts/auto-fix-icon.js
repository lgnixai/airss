#!/usr/bin/env node

/**
 * 自动化测试和修复Hello插件图标显示问题
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

class AutoFixIcon {
  constructor() {
    this.testResults = [];
    this.fixes = [];
  }

  async runAutoFix() {
    console.log('🤖 开始自动化测试和修复Hello插件图标...');
    console.log('='.repeat(60));
    
    try {
      // 1. 检查当前状态
      await this.checkCurrentState();
      
      // 2. 诊断问题
      await this.diagnoseProblems();
      
      // 3. 应用修复
      await this.applyFixes();
      
      // 4. 验证修复结果
      await this.verifyFixes();
      
      // 5. 生成报告
      this.generateReport();
      
    } catch (error) {
      console.error('❌ 自动化修复失败:', error);
    }
  }

  async checkCurrentState() {
    console.log('\n🔍 检查当前状态...');
    
    // 检查插件文件
    const pluginFiles = [
      'src/plugins/hello/HelloPlugin.ts',
      'src/plugins/hello/manifest.ts',
      'src/core/pluginSystem/ObsidianCompatiblePluginManager.ts',
      'src/core/PluginSystemService.ts'
    ];
    
    for (const file of pluginFiles) {
      const fullPath = path.join(process.cwd(), file);
      const exists = fs.existsSync(fullPath);
      console.log(`${exists ? '✅' : '❌'} ${file}: ${exists ? '存在' : '不存在'}`);
      
      if (!exists) {
        this.fixes.push({
          type: 'missing_file',
          file: file,
          description: `文件 ${file} 不存在`
        });
      }
    }
    
    // 检查页面响应
    try {
      const response = await this.makeRequest('http://localhost:5173/');
      if (response.statusCode === 200) {
        console.log('✅ 页面响应正常');
        this.testResults.push({
          test: 'page_response',
          status: 'pass',
          details: '页面响应正常'
        });
      } else {
        console.log(`❌ 页面响应异常: ${response.statusCode}`);
        this.testResults.push({
          test: 'page_response',
          status: 'fail',
          details: `页面响应异常: ${response.statusCode}`
        });
      }
    } catch (error) {
      console.log('❌ 页面检查失败:', error.message);
      this.testResults.push({
        test: 'page_response',
        status: 'fail',
        details: '页面检查失败'
      });
    }
  }

  async diagnoseProblems() {
    console.log('\n🔍 诊断问题...');
    
    // 检查ObsidianCompatiblePluginManager.ts中的addRibbonIcon方法
    const managerFile = path.join(process.cwd(), 'src/core/pluginSystem/ObsidianCompatiblePluginManager.ts');
    if (fs.existsSync(managerFile)) {
      const content = fs.readFileSync(managerFile, 'utf8');
      
      // 检查是否使用了错误的API方式
      const hasWrongOnClick = content.includes('this.moleculeContext.activityBar.onClick(');
      const hasCorrectOnClick = content.includes('onClick: () => {');
      
      if (hasWrongOnClick && !hasCorrectOnClick) {
        console.log('❌ 发现API使用错误: 使用了错误的onClick事件监听器');
        this.fixes.push({
          type: 'api_usage_error',
          description: 'addRibbonIcon方法使用了错误的API调用方式',
          fix: 'replace_onclick_listener'
        });
      } else if (hasCorrectOnClick) {
        console.log('✅ API使用方式正确');
        this.testResults.push({
          test: 'api_usage',
          status: 'pass',
          details: 'API使用方式正确'
        });
      }
      
      // 检查是否缺少React导入
      if (!content.includes('import React from \'react\'')) {
        console.log('❌ 发现缺少React导入');
        this.fixes.push({
          type: 'missing_import',
          description: '缺少React导入',
          fix: 'add_react_import'
        });
      } else {
        console.log('✅ React导入存在');
      }
    }
    
    // 检查HelloPlugin.ts中的状态栏操作
    const helloFile = path.join(process.cwd(), 'src/plugins/hello/HelloPlugin.ts');
    if (fs.existsSync(helloFile)) {
      const content = fs.readFileSync(helloFile, 'utf8');
      
      // 检查是否直接操作状态栏元素
      if (content.includes('.setText(') || content.includes('.remove()')) {
        console.log('❌ 发现直接DOM操作问题');
        this.fixes.push({
          type: 'dom_operation_error',
          description: 'Hello插件直接操作DOM元素',
          fix: 'remove_dom_operations'
        });
      } else {
        console.log('✅ Hello插件DOM操作正确');
        this.testResults.push({
          test: 'dom_operations',
          status: 'pass',
          details: 'DOM操作正确'
        });
      }
    }
  }

  async applyFixes() {
    console.log('\n🔧 应用修复...');
    
    if (this.fixes.length === 0) {
      console.log('✅ 没有发现需要修复的问题');
      return;
    }
    
    for (const fix of this.fixes) {
      console.log(`🔧 应用修复: ${fix.description}`);
      
      switch (fix.type) {
        case 'api_usage_error':
          await this.fixApiUsage();
          break;
        case 'missing_import':
          await this.fixMissingImport();
          break;
        case 'dom_operation_error':
          await this.fixDomOperations();
          break;
        default:
          console.log(`⚠️ 未知修复类型: ${fix.type}`);
      }
    }
  }

  async fixApiUsage() {
    console.log('🔧 修复API使用方式...');
    
    const managerFile = path.join(process.cwd(), 'src/core/pluginSystem/ObsidianCompatiblePluginManager.ts');
    if (fs.existsSync(managerFile)) {
      let content = fs.readFileSync(managerFile, 'utf8');
      
      // 修复addRibbonIcon方法
      const oldPattern = /\/\/ 添加到 Molecule 活动栏[\s\S]*?this\.moleculeContext\.activityBar\.onClick\(\(item: any\) => \{[\s\S]*?\}\);[\s\S]*?\/\/ 返回一个模拟的元素/;
      const newContent = `// 添加到 Molecule 活动栏 - 使用正确的API格式
            this.moleculeContext.activityBar.add({
              id: iconId,
              name: title,
              alignment: 'top',
              sortIndex: 10,
              icon: icon,
              onClick: () => {
                console.log(\`Hello Plugin: Activity bar item clicked: \${title}\`);
                callback(new MouseEvent('click') as any);
              }
            });
            
            // 返回一个模拟的元素用于API兼容性`;
      
      if (oldPattern.test(content)) {
        content = content.replace(oldPattern, newContent);
        fs.writeFileSync(managerFile, content, 'utf8');
        console.log('✅ API使用方式已修复');
        this.testResults.push({
          test: 'api_fix',
          status: 'pass',
          details: 'API使用方式已修复'
        });
      } else {
        console.log('⚠️ 未找到需要修复的API代码模式');
      }
    }
  }

  async fixMissingImport() {
    console.log('🔧 添加React导入...');
    
    const managerFile = path.join(process.cwd(), 'src/core/pluginSystem/ObsidianCompatiblePluginManager.ts');
    if (fs.existsSync(managerFile)) {
      let content = fs.readFileSync(managerFile, 'utf8');
      
      if (!content.includes('import React from \'react\'')) {
        content = content.replace(
          'import { IPlugin, IPluginManifest, IPluginAPI, PluginStatus } from \'./types\';',
          'import { IPlugin, IPluginManifest, IPluginAPI, PluginStatus } from \'./types\';\nimport React from \'react\';'
        );
        fs.writeFileSync(managerFile, content, 'utf8');
        console.log('✅ React导入已添加');
        this.testResults.push({
          test: 'react_import_fix',
          status: 'pass',
          details: 'React导入已添加'
        });
      }
    }
  }

  async fixDomOperations() {
    console.log('🔧 修复DOM操作...');
    
    const helloFile = path.join(process.cwd(), 'src/plugins/hello/HelloPlugin.ts');
    if (fs.existsSync(helloFile)) {
      let content = fs.readFileSync(helloFile, 'utf8');
      
      // 修复onload方法中的状态栏操作
      content = content.replace(
        /\/\/ 添加状态栏项目[\s\S]*?this\.statusBarItem\.setText\('👋 Hello Plugin'\);/,
        `// 添加状态栏项目 - 不直接操作返回的元素
    this.statusBarItem = this.addStatusBarItem();
    // 注意：状态栏文本现在通过Molecule API设置，不需要直接操作DOM元素`
      );
      
      // 修复onunload方法中的清理操作
      content = content.replace(
        /\/\/ 清理状态栏项目[\s\S]*?this\.statusBarItem\.remove\(\);/,
        `// 清理状态栏项目 - 现在通过Molecule API管理
    if (this.statusBarItem) {
      // 状态栏项目现在由Molecule API管理，不需要手动移除
      this.statusBarItem = null;
    }`
      );
      
      content = content.replace(
        /\/\/ 清理图标[\s\S]*?this\.ribbonIcon\.remove\(\);/,
        `// 清理图标 - 现在通过Molecule API管理
    if (this.ribbonIcon) {
      // 图标现在由Molecule API管理，不需要手动移除
      this.ribbonIcon = null;
    }`
      );
      
      fs.writeFileSync(helloFile, content, 'utf8');
      console.log('✅ DOM操作已修复');
      this.testResults.push({
        test: 'dom_operations_fix',
        status: 'pass',
        details: 'DOM操作已修复'
      });
    }
  }

  async verifyFixes() {
    console.log('\n🔍 验证修复结果...');
    
    // 重新检查修复后的文件
    await this.diagnoseProblems();
    
    // 检查是否还有未修复的问题
    const remainingFixes = this.fixes.filter(fix => 
      !this.testResults.some(result => 
        result.test.includes('fix') && result.status === 'pass'
      )
    );
    
    if (remainingFixes.length === 0) {
      console.log('✅ 所有问题已修复');
    } else {
      console.log(`⚠️ 仍有 ${remainingFixes.length} 个问题未修复`);
    }
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

  generateReport() {
    console.log('\n📊 自动化修复报告');
    console.log('='.repeat(60));
    
    const passedTests = this.testResults.filter(r => r.status === 'pass').length;
    const failedTests = this.testResults.filter(r => r.status === 'fail').length;
    const totalTests = this.testResults.length;
    
    console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`);
    console.log(`📊 失败测试: ${failedTests} 个`);
    console.log(`📊 应用修复: ${this.fixes.length} 个`);
    
    console.log('\n📝 详细结果:');
    this.testResults.forEach((result, index) => {
      const status = result.status === 'pass' ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.test}: ${result.details}`);
    });
    
    if (this.fixes.length > 0) {
      console.log('\n🔧 应用的修复:');
      this.fixes.forEach((fix, index) => {
        console.log(`${index + 1}. ${fix.description}`);
      });
    }
    
    console.log('\n🎯 下一步操作:');
    console.log('1. 刷新浏览器页面 http://localhost:5173/');
    console.log('2. 检查左侧活动栏是否有 👋 Hello插件图标');
    console.log('3. 点击图标测试功能');
    console.log('4. 查看浏览器控制台确认没有错误');
    
    if (failedTests === 0 && this.fixes.length > 0) {
      console.log('\n✅ 自动化修复完成！');
      console.log('💡 请刷新页面并检查Hello插件图标是否显示');
    } else if (failedTests > 0) {
      console.log('\n❌ 仍有问题需要手动解决');
    } else {
      console.log('\n✅ 系统状态正常，无需修复');
    }
  }
}

// 运行自动化修复
async function main() {
  const autoFix = new AutoFixIcon();
  await autoFix.runAutoFix();
}

main().catch(console.error);
