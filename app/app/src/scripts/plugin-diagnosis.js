#!/usr/bin/env node

/**
 * 插件诊断脚本
 * 用于诊断插件加载导致页面空白的问题
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

class PluginDiagnosis {
  constructor() {
    this.testResults = [];
  }

  async runDiagnosis() {
    console.log('🔍 开始插件诊断...');
    console.log('='.repeat(50));
    
    try {
      // 检查开发服务器状态
      await this.checkServerStatus();
      
      // 测试页面响应
      await this.testPageResponse();
      
      // 检查编译错误
      await this.checkCompilationErrors();
      
      // 检查插件文件
      await this.checkPluginFiles();
      
      // 检查插件系统代码
      await this.checkPluginSystemCode();
      
      // 生成报告
      this.generateReport();
      
    } catch (error) {
      console.error('❌ 诊断失败:', error);
    }
  }

  async checkServerStatus() {
    console.log('\n🔍 检查开发服务器状态...');
    
    try {
      const response = await this.makeRequest('http://localhost:3000/');
      
      if (response.statusCode === 200) {
        console.log('✅ 开发服务器正常运行');
        console.log(`📊 响应状态: ${response.statusCode}`);
        console.log(`📊 响应长度: ${response.data.length} 字符`);
        
        this.testResults.push({
          test: 'server_status',
          status: 'pass',
          details: `服务器响应正常，状态码: ${response.statusCode}`
        });
        
      } else {
        console.log(`❌ 开发服务器响应异常: ${response.statusCode}`);
        this.testResults.push({
          test: 'server_status',
          status: 'fail',
          details: `服务器响应异常，状态码: ${response.statusCode}`
        });
      }
      
    } catch (error) {
      console.log('❌ 无法连接到开发服务器');
      console.log('💡 请确保运行了 npm run web');
      
      this.testResults.push({
        test: 'server_status',
        status: 'fail',
        details: '无法连接到开发服务器'
      });
    }
  }

  async testPageResponse() {
    console.log('\n🔍 测试页面响应...');
    
    try {
      const htmlResponse = await this.makeRequest('http://localhost:3000/');
      
      if (htmlResponse.statusCode === 200) {
        // 检查HTML结构
        const hasHtml = htmlResponse.data.includes('<html');
        const hasHead = htmlResponse.data.includes('<head');
        const hasBody = htmlResponse.data.includes('<body');
        const hasRoot = htmlResponse.data.includes('id="root"');
        
        console.log(`📊 包含HTML标签: ${hasHtml}`);
        console.log(`📊 包含HEAD标签: ${hasHead}`);
        console.log(`📊 包含BODY标签: ${hasBody}`);
        console.log(`📊 包含ROOT元素: ${hasRoot}`);
        
        if (hasHtml && hasHead && hasBody && hasRoot) {
          console.log('✅ 页面HTML结构正常');
          this.testResults.push({
            test: 'page_structure',
            status: 'pass',
            details: '页面HTML结构完整'
          });
        } else {
          console.log('❌ 页面HTML结构不完整');
          this.testResults.push({
            test: 'page_structure',
            status: 'fail',
            details: '页面HTML结构不完整'
          });
        }
        
        // 检查JavaScript内容
        const hasScript = htmlResponse.data.includes('<script');
        const hasMolecule = htmlResponse.data.includes('molecule');
        const hasPlugin = htmlResponse.data.includes('plugin');
        
        console.log(`📊 包含Script标签: ${hasScript}`);
        console.log(`📊 包含Molecule代码: ${hasMolecule}`);
        console.log(`📊 包含Plugin代码: ${hasPlugin}`);
        
        if (!hasScript) {
          console.log('⚠️ 页面可能缺少JavaScript代码');
        }
        
        if (!hasMolecule) {
          console.log('⚠️ 页面可能缺少Molecule框架代码');
        }
        
      } else {
        console.log(`❌ 页面响应失败: ${htmlResponse.statusCode}`);
        this.testResults.push({
          test: 'page_response',
          status: 'fail',
          details: `页面响应失败，状态码: ${htmlResponse.statusCode}`
        });
      }
      
    } catch (error) {
      console.log('❌ 页面响应测试失败:', error);
      this.testResults.push({
        test: 'page_response',
        status: 'fail',
        details: '页面响应测试失败'
      });
    }
  }

  async checkCompilationErrors() {
    console.log('\n🔍 检查编译错误...');
    
    try {
      const result = await this.runCommand('npm', ['run', 'build'], { timeout: 30000 });
      
      if (result.exitCode === 0) {
        console.log('✅ 编译成功，没有错误');
        this.testResults.push({
          test: 'compilation',
          status: 'pass',
          details: '编译成功'
        });
      } else {
        console.log('❌ 编译失败');
        
        // 分析错误
        const errors = this.analyzeCompilationErrors(result.stderr);
        console.log(`📊 发现 ${errors.length} 个编译错误`);
        
        if (errors.length > 0) {
          console.log('📝 主要错误:');
          errors.slice(0, 5).forEach((error, index) => {
            console.log(`  ${index + 1}. ${error}`);
          });
        }
        
        this.testResults.push({
          test: 'compilation',
          status: 'fail',
          details: `编译失败，${errors.length} 个错误`
        });
      }
      
    } catch (error) {
      console.log('❌ 编译检查失败:', error);
      this.testResults.push({
        test: 'compilation',
        status: 'fail',
        details: '编译检查失败'
      });
    }
  }

  async checkPluginFiles() {
    console.log('\n🔍 检查插件文件...');
    
    const pluginFiles = [
      'src/plugins/hello/HelloPlugin.ts',
      'src/plugins/hello/manifest.ts',
      'src/core/pluginSystem/ObsidianCompatiblePluginManager.ts',
      'src/core/PluginSystemService.ts'
    ];
    
    let allFilesExist = true;
    
    for (const file of pluginFiles) {
      const filePath = path.join(process.cwd(), file);
      const exists = fs.existsSync(filePath);
      
      console.log(`📊 ${file}: ${exists ? '✅' : '❌'}`);
      
      if (!exists) {
        allFilesExist = false;
      }
    }
    
    if (allFilesExist) {
      console.log('✅ 所有插件文件都存在');
      this.testResults.push({
        test: 'plugin_files',
        status: 'pass',
        details: '所有插件文件都存在'
      });
    } else {
      console.log('❌ 部分插件文件缺失');
      this.testResults.push({
        test: 'plugin_files',
        status: 'fail',
        details: '部分插件文件缺失'
      });
    }
  }

  async checkPluginSystemCode() {
    console.log('\n🔍 检查插件系统代码...');
    
    try {
      // 检查PluginSystemService.ts中的关键代码
      const servicePath = path.join(process.cwd(), 'src/core/PluginSystemService.ts');
      
      if (fs.existsSync(servicePath)) {
        const content = fs.readFileSync(servicePath, 'utf8');
        
        const hasObsidianManager = content.includes('ObsidianCompatiblePluginManager');
        const hasHelloPlugin = content.includes('helloPluginManifest');
        const hasPluginRegistration = content.includes('registerObsidianPlugins');
        
        console.log(`📊 包含Obsidian插件管理器: ${hasObsidianManager}`);
        console.log(`📊 包含Hello插件: ${hasHelloPlugin}`);
        console.log(`📊 包含插件注册: ${hasPluginRegistration}`);
        
        if (hasObsidianManager && hasHelloPlugin && hasPluginRegistration) {
          console.log('✅ 插件系统代码完整');
          this.testResults.push({
            test: 'plugin_system_code',
            status: 'pass',
            details: '插件系统代码完整'
          });
        } else {
          console.log('❌ 插件系统代码不完整');
          this.testResults.push({
            test: 'plugin_system_code',
            status: 'fail',
            details: '插件系统代码不完整'
          });
        }
      } else {
        console.log('❌ PluginSystemService.ts文件不存在');
        this.testResults.push({
          test: 'plugin_system_code',
          status: 'fail',
          details: 'PluginSystemService.ts文件不存在'
        });
      }
      
    } catch (error) {
      console.log('❌ 插件系统代码检查失败:', error);
      this.testResults.push({
        test: 'plugin_system_code',
        status: 'fail',
        details: '插件系统代码检查失败'
      });
    }
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 0,
            data: data
          });
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('请求超时'));
      });
    });
  }

  runCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'pipe',
        ...options
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        resolve({
          exitCode: code || 0,
          stdout,
          stderr
        });
      });
      
      child.on('error', (error) => {
        reject(error);
      });
      
      if (options.timeout) {
        setTimeout(() => {
          child.kill();
          reject(new Error('命令执行超时'));
        }, options.timeout);
      }
    });
  }

  analyzeCompilationErrors(stderr) {
    const errorLines = stderr.split('\n').filter(line => 
      line.includes('error') || line.includes('Error') || line.includes('ERROR')
    );
    
    return errorLines.slice(0, 10);
  }

  generateReport() {
    console.log('\n📊 插件诊断报告');
    console.log('='.repeat(50));
    
    const passedTests = this.testResults.filter(r => r.status === 'pass').length;
    const failedTests = this.testResults.filter(r => r.status === 'fail').length;
    const totalTests = this.testResults.length;
    
    console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`);
    console.log(`📊 失败测试: ${failedTests} 个`);
    
    console.log('\n📝 详细结果:');
    this.testResults.forEach((result, index) => {
      const status = result.status === 'pass' ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.test}: ${result.details}`);
    });
    
    // 分析问题
    if (failedTests > 0) {
      console.log('\n🔍 问题分析:');
      
      const serverFailed = this.testResults.find(r => r.test === 'server_status' && r.status === 'fail');
      if (serverFailed) {
        console.log('❌ 开发服务器问题: 服务器未运行或无法访问');
        console.log('🔧 解决方案: 运行 npm run web');
      }
      
      const compilationFailed = this.testResults.find(r => r.test === 'compilation' && r.status === 'fail');
      if (compilationFailed) {
        console.log('❌ 编译问题: 存在TypeScript编译错误');
        console.log('🔧 解决方案: 修复编译错误后重新启动');
      }
      
      const structureFailed = this.testResults.find(r => r.test === 'page_structure' && r.status === 'fail');
      if (structureFailed) {
        console.log('❌ 页面结构问题: HTML结构不完整');
        console.log('🔧 解决方案: 检查React组件渲染');
      }
      
      const pluginCodeFailed = this.testResults.find(r => r.test === 'plugin_system_code' && r.status === 'fail');
      if (pluginCodeFailed) {
        console.log('❌ 插件系统代码问题: 插件系统代码不完整');
        console.log('🔧 解决方案: 检查插件系统集成');
      }
      
      console.log('\n🎯 建议的解决步骤:');
      console.log('1. 确保开发服务器正在运行 (npm run web)');
      console.log('2. 检查浏览器控制台错误');
      console.log('3. 修复编译错误');
      console.log('4. 清除缓存并重新启动');
      console.log('5. 检查插件系统初始化');
      console.log('6. 暂时禁用插件系统测试');
    } else {
      console.log('\n✅ 所有测试通过，页面应该正常工作');
      console.log('💡 如果页面仍然空白，请检查浏览器控制台错误');
    }
  }
}

// 运行诊断
async function main() {
  const diagnosis = new PluginDiagnosis();
  await diagnosis.runDiagnosis();
}

// 运行诊断
main().catch(console.error);
