#!/usr/bin/env node

/**
 * 详细插件测试脚本
 * 用于深入诊断插件加载问题
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

class DetailedPluginTest {
  constructor() {
    this.testResults = [];
  }

  async runDetailedTest() {
    console.log('🔍 开始详细插件测试...');
    console.log('='.repeat(50));
    
    try {
      // 检查页面加载
      await this.checkPageLoading();
      
      // 检查JavaScript文件加载
      await this.checkJavaScriptFiles();
      
      // 检查插件系统初始化
      await this.checkPluginSystemInitialization();
      
      // 检查编译状态
      await this.checkCompilationStatus();
      
      // 检查浏览器控制台错误
      await this.checkBrowserConsole();
      
      // 生成详细报告
      this.generateDetailedReport();
      
    } catch (error) {
      console.error('❌ 详细测试失败:', error);
    }
  }

  async checkPageLoading() {
    console.log('\n🔍 检查页面加载...');
    
    try {
      const response = await this.makeRequest('http://localhost:5173/');
      
      if (response.statusCode === 200) {
        console.log('✅ 页面加载成功');
        console.log(`📊 响应长度: ${response.data.length} 字符`);
        
        // 检查关键HTML元素
        const hasRoot = response.data.includes('id="root"');
        const hasScript = response.data.includes('<script');
        const hasMolecule = response.data.includes('molecule');
        
        console.log(`📊 包含root元素: ${hasRoot}`);
        console.log(`📊 包含script标签: ${hasScript}`);
        console.log(`📊 包含molecule代码: ${hasMolecule}`);
        
        if (hasRoot && hasScript) {
          console.log('✅ 页面HTML结构正常');
          this.testResults.push({
            test: 'page_loading',
            status: 'pass',
            details: '页面加载成功，HTML结构正常'
          });
        } else {
          console.log('❌ 页面HTML结构异常');
          this.testResults.push({
            test: 'page_loading',
            status: 'fail',
            details: '页面HTML结构异常'
          });
        }
        
      } else {
        console.log(`❌ 页面加载失败: ${response.statusCode}`);
        this.testResults.push({
          test: 'page_loading',
          status: 'fail',
          details: `页面加载失败，状态码: ${response.statusCode}`
        });
      }
      
    } catch (error) {
      console.log('❌ 页面加载检查失败:', error.message);
      this.testResults.push({
        test: 'page_loading',
        status: 'fail',
        details: '页面加载检查失败'
      });
    }
  }

  async checkJavaScriptFiles() {
    console.log('\n🔍 检查JavaScript文件加载...');
    
    try {
      // 检查主要的JavaScript文件
      const jsFiles = [
        'http://localhost:5173/src/main.tsx',
        'http://localhost:5173/src/App.tsx',
        'http://localhost:5173/src/extensions/TestExtension.tsx'
      ];
      
      let allFilesLoadable = true;
      
      for (const file of jsFiles) {
        try {
          const response = await this.makeRequest(file);
          const status = response.statusCode === 200 ? '✅' : '❌';
          console.log(`📊 ${file}: ${status} (${response.statusCode})`);
          
          if (response.statusCode !== 200) {
            allFilesLoadable = false;
          }
        } catch (error) {
          console.log(`📊 ${file}: ❌ (错误: ${error.message})`);
          allFilesLoadable = false;
        }
      }
      
      if (allFilesLoadable) {
        console.log('✅ 所有JavaScript文件可加载');
        this.testResults.push({
          test: 'javascript_files',
          status: 'pass',
          details: '所有JavaScript文件可加载'
        });
      } else {
        console.log('❌ 部分JavaScript文件无法加载');
        this.testResults.push({
          test: 'javascript_files',
          status: 'fail',
          details: '部分JavaScript文件无法加载'
        });
      }
      
    } catch (error) {
      console.log('❌ JavaScript文件检查失败:', error.message);
      this.testResults.push({
        test: 'javascript_files',
        status: 'fail',
        details: 'JavaScript文件检查失败'
      });
    }
  }

  async checkPluginSystemInitialization() {
    console.log('\n🔍 检查插件系统初始化...');
    
    try {
      // 检查插件系统相关文件
      const pluginFiles = [
        'src/core/PluginSystemService.ts',
        'src/core/pluginSystem/ObsidianCompatiblePluginManager.ts',
        'src/plugins/hello/HelloPlugin.ts',
        'src/plugins/hello/manifest.ts'
      ];
      
      let allFilesExist = true;
      let hasPluginCode = true;
      
      for (const file of pluginFiles) {
        const filePath = path.join(process.cwd(), file);
        const exists = fs.existsSync(filePath);
        
        console.log(`📊 ${file}: ${exists ? '✅' : '❌'}`);
        
        if (!exists) {
          allFilesExist = false;
        } else {
          // 检查文件内容
          const content = fs.readFileSync(filePath, 'utf8');
          
          if (file.includes('PluginSystemService')) {
            const hasObsidianManager = content.includes('ObsidianCompatiblePluginManager');
            const hasHelloPlugin = content.includes('helloPluginManifest');
            
            console.log(`  - 包含Obsidian管理器: ${hasObsidianManager}`);
            console.log(`  - 包含Hello插件: ${hasHelloPlugin}`);
            
            if (!hasObsidianManager || !hasHelloPlugin) {
              hasPluginCode = false;
            }
          }
        }
      }
      
      if (allFilesExist && hasPluginCode) {
        console.log('✅ 插件系统文件完整');
        this.testResults.push({
          test: 'plugin_system_files',
          status: 'pass',
          details: '插件系统文件完整'
        });
      } else {
        console.log('❌ 插件系统文件不完整');
        this.testResults.push({
          test: 'plugin_system_files',
          status: 'fail',
          details: '插件系统文件不完整'
        });
      }
      
    } catch (error) {
      console.log('❌ 插件系统检查失败:', error.message);
      this.testResults.push({
        test: 'plugin_system_files',
        status: 'fail',
        details: '插件系统检查失败'
      });
    }
  }

  async checkCompilationStatus() {
    console.log('\n🔍 检查编译状态...');
    
    try {
      const result = await this.runCommand('npm', ['run', 'build'], { timeout: 30000 });
      
      if (result.exitCode === 0) {
        console.log('✅ 编译成功');
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
      console.log('❌ 编译检查失败:', error.message);
      this.testResults.push({
        test: 'compilation',
        status: 'fail',
        details: '编译检查失败'
      });
    }
  }

  async checkBrowserConsole() {
    console.log('\n🔍 检查浏览器控制台...');
    
    console.log('📝 请手动检查浏览器控制台是否有以下错误:');
    console.log('1. JavaScript运行时错误');
    console.log('2. 模块加载错误');
    console.log('3. 插件系统初始化错误');
    console.log('4. Molecule框架错误');
    
    console.log('\n💡 调试步骤:');
    console.log('1. 打开浏览器开发者工具 (F12)');
    console.log('2. 切换到Console标签页');
    console.log('3. 刷新页面');
    console.log('4. 查看错误信息');
    
    this.testResults.push({
      test: 'browser_console',
      status: 'manual',
      details: '需要手动检查浏览器控制台'
    });
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

  generateDetailedReport() {
    console.log('\n📊 详细插件测试报告');
    console.log('='.repeat(50));
    
    const passedTests = this.testResults.filter(r => r.status === 'pass').length;
    const failedTests = this.testResults.filter(r => r.status === 'fail').length;
    const manualTests = this.testResults.filter(r => r.status === 'manual').length;
    const totalTests = this.testResults.length;
    
    console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`);
    console.log(`📊 失败测试: ${failedTests} 个`);
    console.log(`📊 手动测试: ${manualTests} 个`);
    
    console.log('\n📝 详细结果:');
    this.testResults.forEach((result, index) => {
      const status = result.status === 'pass' ? '✅' : result.status === 'manual' ? '🔍' : '❌';
      console.log(`${index + 1}. ${status} ${result.test}: ${result.details}`);
    });
    
    // 分析问题
    if (failedTests > 0) {
      console.log('\n🔍 问题分析:');
      
      const pageLoadingFailed = this.testResults.find(r => r.test === 'page_loading' && r.status === 'fail');
      if (pageLoadingFailed) {
        console.log('❌ 页面加载问题: 页面无法正常加载');
        console.log('🔧 解决方案: 检查开发服务器和网络连接');
      }
      
      const jsFilesFailed = this.testResults.find(r => r.test === 'javascript_files' && r.status === 'fail');
      if (jsFilesFailed) {
        console.log('❌ JavaScript文件问题: 部分文件无法加载');
        console.log('🔧 解决方案: 检查文件路径和编译状态');
      }
      
      const pluginSystemFailed = this.testResults.find(r => r.test === 'plugin_system_files' && r.status === 'fail');
      if (pluginSystemFailed) {
        console.log('❌ 插件系统问题: 插件系统文件不完整');
        console.log('🔧 解决方案: 检查插件系统集成');
      }
      
      const compilationFailed = this.testResults.find(r => r.test === 'compilation' && r.status === 'fail');
      if (compilationFailed) {
        console.log('❌ 编译问题: 存在TypeScript编译错误');
        console.log('🔧 解决方案: 修复编译错误后重新启动');
      }
      
      console.log('\n🎯 建议的解决步骤:');
      console.log('1. 检查浏览器控制台错误');
      console.log('2. 修复编译错误');
      console.log('3. 清除缓存并重新启动');
      console.log('4. 检查插件系统初始化');
      console.log('5. 暂时禁用插件系统测试');
      console.log('6. 检查Molecule框架依赖');
    } else {
      console.log('\n✅ 所有自动测试通过');
      console.log('💡 如果页面仍然空白，请检查浏览器控制台错误');
    }
    
    console.log('\n🔍 下一步诊断:');
    console.log('1. 运行浏览器控制台检查');
    console.log('2. 查看网络请求状态');
    console.log('3. 检查React组件渲染');
    console.log('4. 验证Molecule框架初始化');
  }
}

// 运行详细测试
async function main() {
  const test = new DetailedPluginTest();
  await test.runDetailedTest();
}

// 运行测试
main().catch(console.error);
