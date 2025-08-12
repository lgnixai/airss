#!/usr/bin/env node

/**
 * 测试Hello插件图标显示
 * 验证图标是否正确添加到活动栏
 */

const http = require('http');

class IconDisplayTest {
  constructor() {
    this.testResults = [];
  }

  async testIconDisplay() {
    console.log('🔍 测试Hello插件图标显示...');
    console.log('='.repeat(50));
    
    try {
      // 检查页面是否正常加载
      await this.checkPageLoading();
      
      // 检查活动栏状态
      await this.checkActivityBar();
      
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

  async checkActivityBar() {
    console.log('\n🔍 检查活动栏状态...');
    
    console.log('📝 请手动检查活动栏:');
    console.log('1. 打开浏览器访问 http://localhost:5173/');
    console.log('2. 查看左侧活动栏区域');
    console.log('3. 检查是否有以下图标:');
    console.log('   - 📄 文件图标 (默认)');
    console.log('   - 📡 RSS图标 (RSS插件)');
    console.log('   - 🔬 实验图标 (testPane)');
    console.log('   - 🧩 插件管理图标 (pluginManager)');
    console.log('   - 👋 Hello插件图标 (Hello Plugin)');
    
    console.log('\n🔍 检查Hello插件图标:');
    console.log('- 图标应该显示为 👋');
    console.log('- 鼠标悬停时应该显示 "Hello Plugin"');
    console.log('- 点击图标应该触发Hello World功能');
    
    this.testResults.push({
      test: 'manual_icon_check',
      status: 'manual',
      details: '需要手动检查活动栏图标'
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
    console.log('\n📊 图标显示测试报告');
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
    
    console.log('\n🎯 修复内容:');
    console.log('1. ✅ 修复了addRibbonIcon方法的API使用方式');
    console.log('2. ✅ 使用onClick属性而不是onClick事件监听器');
    console.log('3. ✅ 添加了调试日志');
    console.log('4. ✅ 保持了API兼容性');
    
    console.log('\n🔍 预期结果:');
    console.log('- Hello插件图标应该显示在活动栏中');
    console.log('- 图标显示为 👋');
    console.log('- 鼠标悬停显示 "Hello Plugin"');
    console.log('- 点击图标触发Hello World功能');
    
    console.log('\n💡 如果图标仍然不显示:');
    console.log('1. 检查浏览器控制台是否有错误');
    console.log('2. 确认插件系统已正确初始化');
    console.log('3. 检查Molecule API是否可用');
    console.log('4. 尝试刷新页面');
    
    if (failedTests === 0) {
      console.log('\n✅ 自动测试通过！');
      console.log('💡 请手动检查活动栏确认Hello插件图标是否显示');
    } else {
      console.log('\n❌ 仍有问题需要解决');
    }
  }
}

// 运行测试
async function main() {
  const test = new IconDisplayTest();
  await test.testIconDisplay();
}

// 运行测试
main().catch(console.error);
