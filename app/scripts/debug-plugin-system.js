#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

class PluginSystemDebugger {
  async debugPluginSystem() {
    console.log('🔍 诊断插件系统状态...');
    console.log('='.repeat(50));
    
    // 检查插件文件
    await this.checkPluginFiles();
    
    // 检查页面响应
    await this.checkPageResponse();
    
    // 生成诊断报告
    this.generateReport();
  }

  async checkPluginFiles() {
    console.log('\n📁 检查插件文件...');
    
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
      
      if (exists) {
        const stats = fs.statSync(fullPath);
        console.log(`   📊 大小: ${stats.size} 字节`);
        console.log(`   📅 修改时间: ${stats.mtime.toLocaleString()}`);
      }
    }
  }

  async checkPageResponse() {
    console.log('\n🌐 检查页面响应...');
    
    try {
      const response = await this.makeRequest('http://localhost:5173/');
      
      if (response.statusCode === 200) {
        console.log('✅ 页面响应成功');
        console.log(`📊 响应长度: ${response.data.length} 字符`);
        
        // 检查是否包含插件相关代码
        const hasPluginSystem = response.data.includes('PluginSystemService');
        const hasHelloPlugin = response.data.includes('HelloPlugin');
        const hasObsidianManager = response.data.includes('ObsidianCompatiblePluginManager');
        
        console.log(`🔍 包含插件系统代码: ${hasPluginSystem ? '✅' : '❌'}`);
        console.log(`🔍 包含Hello插件代码: ${hasHelloPlugin ? '✅' : '❌'}`);
        console.log(`🔍 包含Obsidian管理器: ${hasObsidianManager ? '✅' : '❌'}`);
        
      } else {
        console.log(`❌ 页面响应失败: ${response.statusCode}`);
      }
    } catch (error) {
      console.log('❌ 页面检查失败:', error.message);
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
    console.log('\n📊 诊断报告');
    console.log('='.repeat(50));
    
    console.log('\n🎯 修复内容:');
    console.log('1. ✅ 修复了addRibbonIcon方法的API使用方式');
    console.log('2. ✅ 使用onClick属性而不是onClick事件监听器');
    console.log('3. ✅ 添加了调试日志');
    
    console.log('\n🔍 下一步检查:');
    console.log('1. 打开浏览器访问 http://localhost:5173/');
    console.log('2. 按F12打开开发者工具');
    console.log('3. 查看Console标签页');
    console.log('4. 检查是否有以下日志:');
    console.log('   - "Hello Plugin loaded!"');
    console.log('   - "✅ Ribbon icon added to activity bar"');
    console.log('   - 任何错误信息');
    
    console.log('\n💡 如果图标仍然不显示:');
    console.log('- 检查Molecule API是否可用');
    console.log('- 确认插件系统初始化成功');
    console.log('- 查看活动栏是否有其他图标');
    console.log('- 尝试刷新页面');
  }
}

new PluginSystemDebugger().debugPluginSystem().catch(console.error);
