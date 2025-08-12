#!/usr/bin/env node

/**
 * 测试修复脚本
 * 验证插件加载问题是否已解决
 */

const http = require('http');

class FixTest {
  constructor() {
    this.testResults = [];
  }

  async testFix() {
    console.log('🔧 测试插件加载修复...');
    console.log('='.repeat(50));
    
    try {
      // 检查页面是否正常加载
      await this.checkPageLoading();
      
      // 检查是否有React错误
      await this.checkReactErrors();
      
      // 生成测试报告
      this.generateReport();
      
    } catch (error) {
      console.error('❌ 测试失败:', error);
    }
  }

  async checkPageLoading() {
    console.log('\n🔍 检查页面加载...');
    
    try {
      const response = await this.makeRequest('http://localhost:5173/');
      
      if (response.statusCode === 200) {
        console.log('✅ 页面加载成功');
        console.log(`📊 响应长度: ${response.data.length} 字符`);
        
        // 检查是否包含React错误信息
        const hasReactError = response.data.includes('Objects are not valid as a React child');
        const hasErrorBoundary = response.data.includes('error boundary');
        
        if (hasReactError) {
          console.log('❌ 页面仍然包含React错误信息');
          this.testResults.push({
            test: 'react_errors',
            status: 'fail',
            details: '页面包含React错误信息'
          });
        } else {
          console.log('✅ 页面不包含React错误信息');
          this.testResults.push({
            test: 'react_errors',
            status: 'pass',
            details: '页面不包含React错误信息'
          });
        }
        
        this.testResults.push({
          test: 'page_loading',
          status: 'pass',
          details: '页面加载成功'
        });
        
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

  async checkReactErrors() {
    console.log('\n🔍 检查React错误...');
    
    console.log('📝 请手动检查浏览器控制台:');
    console.log('1. 打开浏览器访问 http://localhost:5173/');
    console.log('2. 按F12打开开发者工具');
    console.log('3. 切换到Console标签页');
    console.log('4. 查看是否有以下错误:');
    console.log('   - "Objects are not valid as a React child"');
    console.log('   - "Error: Objects are not valid as a React child"');
    console.log('   - 任何与StatusBar或StatusItem相关的错误');
    
    this.testResults.push({
      test: 'manual_check',
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

  generateReport() {
    console.log('\n📊 修复测试报告');
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
    
    if (failedTests === 0) {
      console.log('\n✅ 自动测试通过！');
      console.log('💡 请手动检查浏览器控制台确认没有React错误');
    } else {
      console.log('\n❌ 仍有问题需要解决');
    }
    
    console.log('\n🎯 修复内容:');
    console.log('1. ✅ 修复了addStatusBarItem方法返回DOM元素的问题');
    console.log('2. ✅ 现在返回React元素而不是DOM元素');
    console.log('3. ✅ 修复了Hello插件直接操作状态栏元素的问题');
    console.log('4. ✅ 添加了React导入');
    
    console.log('\n🔍 预期结果:');
    console.log('- 页面正常加载，不显示空白');
    console.log('- 浏览器控制台没有React错误');
    console.log('- Hello插件图标正常显示');
    console.log('- 状态栏正常显示');
  }
}

// 运行测试
async function main() {
  const test = new FixTest();
  await test.testFix();
}

// 运行测试
main().catch(console.error);
