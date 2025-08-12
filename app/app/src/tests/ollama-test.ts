// Ollama API 测试脚本
export class OllamaAPITester {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string = 'http://localhost:11434', model: string = 'qwen2.5:latest') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  // 测试API连接
  async testConnection(): Promise<{ success: boolean; message: string; time?: number }> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: `✅ API连接成功！响应时间: ${responseTime}ms`,
          time: responseTime
        };
      } else {
        return {
          success: false,
          message: `❌ API连接失败: HTTP ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `❌ API连接错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  // 测试模型可用性
  async testModel(): Promise<{ success: boolean; message: string; availableModels?: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      
      if (response.ok) {
        const data = await response.json();
        const availableModels = data.models?.map((model: any) => model.name) || [];
        
        if (availableModels.includes(this.model)) {
          return {
            success: true,
            message: `✅ 模型 "${this.model}" 可用`,
            availableModels
          };
        } else {
          return {
            success: false,
            message: `❌ 模型 "${this.model}" 不可用。可用模型: ${availableModels.join(', ')}`,
            availableModels
          };
        }
      } else {
        return {
          success: false,
          message: `❌ 无法获取模型列表: HTTP ${response.status}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `❌ 获取模型列表失败: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  // 测试简单生成
  async testGeneration(prompt: string = '你好，请简单回复"测试成功"', maxTokens: number = 50): Promise<{ success: boolean; message: string; response?: string; time?: number }> {
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
        return {
          success: true,
          message: `✅ 生成成功！响应时间: ${responseTime}ms`,
          response: data.response,
          time: responseTime
        };
      } else {
        return {
          success: false,
          message: `❌ 生成失败: HTTP ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `❌ 生成错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  // 完整测试
  async runFullTest(): Promise<{
    connection: any;
    model: any;
    generation: any;
    summary: string;
  }> {
    console.log('🚀 开始 Ollama API 测试...');
    
    // 测试连接
    console.log('📡 测试API连接...');
    const connectionTest = await this.testConnection();
    console.log(connectionTest.message);
    
    // 测试模型
    console.log('🤖 测试模型可用性...');
    const modelTest = await this.testModel();
    console.log(modelTest.message);
    
    // 测试生成
    console.log('💬 测试文本生成...');
    const generationTest = await this.testGeneration();
    console.log(generationTest.message);
    if (generationTest.response) {
      console.log(`📝 生成内容: ${generationTest.response}`);
    }
    
    // 生成总结
    const allTestsPassed = connectionTest.success && modelTest.success && generationTest.success;
    const summary = allTestsPassed 
      ? '🎉 所有测试通过！Ollama API 工作正常。'
      : '⚠️ 部分测试失败，请检查配置。';
    
    return {
      connection: connectionTest,
      model: modelTest,
      generation: generationTest,
      summary
    };
  }

  // 性能测试
  async performanceTest(iterations: number = 3): Promise<{ averageTime: number; results: any[] }> {
    console.log(`⚡ 开始性能测试 (${iterations} 次迭代)...`);
    
    const results = [];
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      console.log(`第 ${i + 1} 次测试...`);
      const result = await this.testGeneration('测试性能', 20);
      results.push(result);
      
      if (result.time) {
        times.push(result.time);
      }
      
      // 等待一秒再进行下一次测试
      if (i < iterations - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const averageTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    
    console.log(`📊 性能测试结果:`);
    console.log(`   平均响应时间: ${averageTime.toFixed(0)}ms`);
    console.log(`   最快响应时间: ${Math.min(...times)}ms`);
    console.log(`   最慢响应时间: ${Math.max(...times)}ms`);
    
    return {
      averageTime,
      results
    };
  }
}

// 导出测试函数
export async function testOllamaAPI(baseUrl?: string, model?: string) {
  const tester = new OllamaAPITester(baseUrl, model);
  return await tester.runFullTest();
}

export async function testOllamaPerformance(baseUrl?: string, model?: string, iterations?: number) {
  const tester = new OllamaAPITester(baseUrl, model);
  return await tester.performanceTest(iterations);
}
