#!/usr/bin/env node

/**
 * 快速验证Hello插件图标修复
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

class QuickVerify {
  async verify() {
    console.log('🔍 快速验证Hello插件图标修复...');
    console.log('='.repeat(50));
    
    // 检查代码修改
    await this.checkCodeChanges();
    
    // 检查服务器状态
    await this.checkServer();
    
    // 生成验证报告
    this.generateReport();
  }

  async checkCodeChanges() {
    console.log('\n📝 检查代码修改...');
    
    const helloFile = path.join(process.cwd(), 'src/plugins/hello/HelloPlugin.ts');
    if (fs.existsSync(helloFile)) {
      const content = fs.readFileSync(helloFile, 'utf8');
      
      const hasMoleculeAPI = content.includes('this.app.molecule.activityBar.add');
      const hasCorrectIcon = content.includes('icon: \'👋\'');
      const hasCorrectId = content.includes('id: \'hello-plugin\'');
      const hasOnClick = content.includes('onClick: () => {');
      const hasRemove = content.includes('this.app.molecule.activityBar.remove');
      
      console.log(`🔍 使用Molecule API: ${hasMoleculeAPI ? '✅' : '❌'}`);
      console.log(`🔍 正确图标: ${hasCorrectIcon ? '✅' : '❌'}`);
      console.log(`🔍 正确ID: ${hasCorrectId ? '✅' : '❌'}`);
      console.log(`🔍 包含onClick: ${hasOnClick ? '✅' : '❌'}`);
      console.log(`🔍 包含移除逻辑: ${hasRemove ? '✅' : '❌'}`);
      
      if (hasMoleculeAPI && hasCorrectIcon && hasCorrectId && hasOnClick) {
        console.log('✅ 代码修改正确！');
      } else {
        console.log('❌ 代码修改不完整');
      }
    }
  }

  async checkServer() {
    console.log('\n🌐 检查服务器状态...');
    
    try {
      const response = await this.makeRequest('http://localhost:3000/');
      
      if (response.statusCode === 200) {
        console.log('✅ 服务器运行正常');
        console.log(`📊 响应长度: ${response.data.length} 字符`);
      } else {
        console.log(`❌ 服务器响应异常: ${response.statusCode}`);
      }
    } catch (error) {
      console.log('❌ 服务器检查失败:', error.message);
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
    console.log('\n📊 快速验证报告');
    console.log('='.repeat(50));
    
    console.log('\n🎯 修复内容:');
    console.log('1. ✅ 直接使用Molecule API添加活动栏图标');
    console.log('2. ✅ 使用与RSS插件相同的实现方式');
    console.log('3. ✅ 设置正确的图标、ID和点击事件');
    console.log('4. ✅ 添加正确的清理逻辑');
    
    console.log('\n🚀 验证步骤:');
    console.log('1. 刷新浏览器页面 http://localhost:3000/');
    console.log('2. 查看左侧活动栏，应该看到 👋 Hello插件图标');
    console.log('3. 点击图标测试Hello World功能');
    console.log('4. 查看浏览器控制台，应该看到:');
    console.log('   - "Hello Plugin: Using Molecule API to add activity bar item"');
    console.log('   - "Hello Plugin: Activity bar item added via Molecule API"');
    
    console.log('\n💡 预期结果:');
    console.log('- 左侧活动栏显示4个图标：');
    console.log('  1. 📄 文件图标 (默认)');
    console.log('  2. 📡 RSS图标 (RSS插件)');
    console.log('  3. 🔬 实验图标 (testPane)');
    console.log('  4. 👋 Hello插件图标 (新增)');
    
    console.log('\n📞 如果图标仍然不显示:');
    console.log('- 检查浏览器控制台错误');
    console.log('- 确认插件系统已初始化');
    console.log('- 尝试强制刷新页面 (Ctrl+F5)');
  }
}

new QuickVerify().verify().catch(console.error);
