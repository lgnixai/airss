#!/usr/bin/env node

const http = require('http');

class IconTest {
  async testIcon() {
    console.log('🔍 测试Hello插件图标显示...');
    
    try {
      const response = await this.makeRequest('http://localhost:3000/');
      
      if (response.statusCode === 200) {
        console.log('✅ 页面加载成功');
        console.log('\n📝 请手动检查活动栏:');
        console.log('1. 打开浏览器访问 http://localhost:3000/');
        console.log('2. 查看左侧活动栏区域');
        console.log('3. 检查是否有 👋 Hello插件图标');
        console.log('4. 点击图标测试功能');
      } else {
        console.log(`❌ 页面加载失败: ${response.statusCode}`);
      }
    } catch (error) {
      console.log('❌ 测试失败:', error.message);
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
}

new IconTest().testIcon().catch(console.error);
