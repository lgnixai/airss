#!/usr/bin/env node

// Ollama API 测试脚本
// 使用 Node.js 内置的 fetch API (Node.js 18+)

class OllamaTester {
  constructor(baseUrl = 'http://localhost:11434', model = 'qwen2.5:latest') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async testConnection() {
    console.log('📡 测试API连接...');
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        console.log(`✅ API连接成功！响应时间: ${responseTime}ms`);
        return true;
      } else {
        console.log(`❌ API连接失败: HTTP ${response.status} ${response.statusText}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ API连接错误: ${error.message}`);
      return false;
    }
  }

  async testModel() {
    console.log('🤖 测试模型可用性...');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      
      if (response.ok) {
        const data = await response.json();
        const availableModels = data.models?.map(model => model.name) || [];
        
        console.log(`📋 可用模型: ${availableModels.join(', ')}`);
        
        if (availableModels.includes(this.model)) {
          console.log(`✅ 模型 "${this.model}" 可用`);
          return true;
        } else {
          console.log(`❌ 模型 "${this.model}" 不可用`);
          return false;
        }
      } else {
        console.log(`❌ 无法获取模型列表: HTTP ${response.status}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ 获取模型列表失败: ${error.message}`);
      return false;
    }
  }

  async testGeneration(prompt = '你好，请简单回复"测试成功"', maxTokens = 50) {
    console.log('💬 测试文本生成...');
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            num_predict: maxTokens
          }
        })
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ 生成成功！响应时间: ${responseTime}ms`);
        console.log(`📝 生成内容: ${data.response}`);
        return true;
      } else {
        console.log(`❌ 生成失败: HTTP ${response.status} ${response.statusText}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ 生成错误: ${error.message}`);
      return false;
    }
  }

  async performanceTest(iterations = 3) {
    console.log(`⚡ 开始性能测试 (${iterations} 次迭代)...`);
    
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      console.log(`第 ${i + 1} 次测试...`);
      const startTime = Date.now();
      
      try {
        const response = await fetch(`${this.baseUrl}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.model,
            prompt: '测试性能',
            stream: false,
            options: {
              num_predict: 20
            }
          })
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;
        times.push(responseTime);
        
        if (response.ok) {
          console.log(`   响应时间: ${responseTime}ms`);
        } else {
          console.log(`   失败: HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(`   错误: ${error.message}`);
      }
      
      // 等待一秒再进行下一次测试
      if (i < iterations - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (times.length > 0) {
      const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
      console.log(`\n📊 性能测试结果:`);
      console.log(`   平均响应时间: ${averageTime.toFixed(0)}ms`);
      console.log(`   最快响应时间: ${Math.min(...times)}ms`);
      console.log(`   最慢响应时间: ${Math.max(...times)}ms`);
    }
  }

  async runFullTest() {
    console.log('🚀 开始 Ollama API 测试...\n');
    
    const connectionOk = await this.testConnection();
    console.log('');
    
    if (!connectionOk) {
      console.log('❌ API连接失败，停止测试');
      return;
    }
    
    const modelOk = await this.testModel();
    console.log('');
    
    if (!modelOk) {
      console.log('❌ 模型不可用，停止测试');
      return;
    }
    
    const generationOk = await this.testGeneration();
    console.log('');
    
    if (generationOk) {
      await this.performanceTest(3);
      console.log('\n🎉 所有测试完成！');
    } else {
      console.log('\n⚠️ 生成测试失败');
    }
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const baseUrl = args[0] || 'http://localhost:11434';
  const model = args[1] || 'qwen2.5:latest';
  
  console.log(`🔧 Ollama API 测试工具`);
  console.log(`   服务地址: ${baseUrl}`);
  console.log(`   模型名称: ${model}\n`);
  
  const tester = new OllamaTester(baseUrl, model);
  await tester.runFullTest();
}

// 运行测试
if (require.main === module) {
  main().catch(console.error);
}

module.exports = OllamaTester;
