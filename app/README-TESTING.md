# Molecule 自动化测试工具

这是一个基于 Puppeteer 的自动化测试工具，用于测试 Molecule 应用的功能。

## 🚀 快速开始

### 1. 启动应用
```bash
pnpm dev
```

### 2. 运行测试
```bash
# 方式一：使用 npm 脚本
pnpm test:automation

# 方式二：使用 shell 脚本（推荐）
./scripts/run-tests.sh

# 方式三：无头模式运行
pnpm test:automation:headless
```

## 📋 测试用例

### 核心功能测试
- ✅ **页面加载测试**: 验证应用页面能够正常加载
- ✅ **RSS 插件加载测试**: 验证 RSS 插件能够正常加载和显示
- ✅ **AI 助手插件加载测试**: 验证 AI 助手插件能够正常加载
- ✅ **RSS 文章打开测试**: 验证点击 RSS 文章能够在编辑器中正确显示内容
- ✅ **AI 助手功能测试**: 验证 AI 助手界面和按钮能够正常显示
- ✅ **AuxiliaryBar 显示测试**: 验证 AuxiliaryBar 能够正常显示

## 🛠️ 技术栈

- **Puppeteer**: 浏览器自动化
- **TypeScript**: 类型安全
- **tsx**: TypeScript 执行器

## 📁 文件结构

```
app/
├── src/tests/
│   ├── automation.ts      # 主要测试逻辑
│   ├── logger.ts          # 日志收集器
│   └── config.ts          # 测试配置
├── scripts/
│   ├── test.ts            # 测试入口
│   └── run-tests.sh       # 一键测试脚本
└── README-TESTING.md      # 本文档
```

## ⚙️ 配置选项

### 浏览器配置
```typescript
browser: {
  headless: false, // 设置为 true 可以无头模式运行
  viewport: { width: 1920, height: 1080 }
}
```

### 测试超时
```typescript
timeouts: {
  pageLoad: 10000,    // 页面加载超时
  elementWait: 5000,  // 元素等待超时
  actionWait: 2000    // 操作等待超时
}
```

## 🔧 自定义测试

### 添加新的测试用例
1. 在 `src/tests/automation.ts` 中添加新的测试方法
2. 在 `TestCases` 数组中注册测试用例
3. 在 `config.ts` 中添加相关配置

### 示例
```typescript
private async testCustomFeature() {
  if (!this.page) throw new Error('页面未初始化');
  
  // 等待元素出现
  await this.page.waitForSelector(TestConfig.selectors.customElement);
  
  // 执行操作
  await this.page.click(TestConfig.selectors.customButton);
  
  // 验证结果
  const result = await this.page.evaluate(() => {
    // 验证逻辑
    return true;
  });
  
  if (!result) {
    throw new Error('自定义功能测试失败');
  }
}
```

## 📊 测试报告

测试完成后会生成详细的测试报告，包括：
- 总测试数
- 通过/失败数量
- 成功率
- 每个测试的详细结果和耗时

## 🐛 故障排除

### 常见问题

1. **应用未启动**
   ```
   ❌ 应用未运行，请先启动开发服务器: pnpm dev
   ```

2. **浏览器启动失败**
   ```bash
   # 在 macOS 上可能需要允许权限
   sudo xattr -rd com.apple.quarantine /path/to/puppeteer
   ```

3. **元素找不到**
   - 检查选择器是否正确
   - 确认页面已完全加载
   - 增加等待时间

### 调试模式

设置 `headless: false` 可以看到浏览器操作过程：
```typescript
this.browser = await puppeteer.launch({
  headless: false, // 显示浏览器窗口
  slowMo: 1000     // 放慢操作速度
});
```

## 📝 日志收集

测试工具会自动收集浏览器控制台的日志，用于：
- 验证插件加载状态
- 调试功能问题
- 生成测试报告

## 🔄 持续集成

可以将测试集成到 CI/CD 流程中：

```yaml
# GitHub Actions 示例
- name: Run Tests
  run: |
    pnpm dev &
    sleep 10
    pnpm test:automation:headless
```

## 📞 支持

如果遇到问题，请：
1. 检查应用是否正常运行
2. 查看测试日志输出
3. 确认浏览器环境配置
4. 提交 Issue 并附上详细错误信息

