# Hello Plugin

一个简单的 Hello World 插件，用于验证 Obsidian 兼容插件系统的开发流程。

## 功能特性

- ✅ **状态栏集成**: 在状态栏显示插件状态
- ✅ **图标点击**: 点击功能区图标触发功能
- ✅ **侧边栏显示**: 在侧边栏显示插件内容
- ✅ **编辑器集成**: 在编辑器中创建和显示内容
- ✅ **命令支持**: 支持通过命令面板调用
- ✅ **通知系统**: 显示友好的通知消息

## 使用方法

1. **点击图标**: 点击左侧活动栏的 👋 图标
2. **命令面板**: 使用命令面板执行 "Show Hello World"
3. **查看效果**: 观察侧边栏和编辑器中的内容变化

## 技术实现

### 插件结构

```
src/plugins/hello/
├── HelloPlugin.ts    # 插件主文件
├── manifest.ts       # 插件清单
└── README.md         # 本文档
```

### 核心代码

```typescript
export class HelloPlugin extends Plugin {
  async onload() {
    // 添加状态栏项目
    this.statusBarItem = this.addStatusBarItem();
    this.statusBarItem.setText('👋 Hello Plugin');

    // 添加功能区图标
    this.ribbonIcon = this.addRibbonIcon('👋', 'Hello Plugin', (evt) => {
      this.showHelloWorld();
    });

    // 添加命令
    this.addCommand({
      id: 'hello-show-message',
      name: 'Show Hello World',
      callback: () => {
        this.showHelloWorld();
      }
    });
  }
}
```

### 主要方法

- `showHelloWorld()`: 主要功能方法，显示 Hello World
- `showHelloInSidebar()`: 在侧边栏显示内容
- `showHelloInEditor()`: 在编辑器中显示内容
- `showNotice()`: 显示通知消息

## 开发验证

这个插件验证了以下功能：

1. **插件生命周期**: `onload` 和 `onunload` 方法
2. **UI 集成**: 状态栏、功能区图标、侧边栏
3. **编辑器集成**: 创建和打开文件
4. **命令系统**: 全局命令注册
5. **事件处理**: 点击事件和回调
6. **数据存储**: 插件数据的保存和加载

## 安装和运行

1. 插件已集成到 `PluginSystemService` 中
2. 应用启动时会自动加载和启用插件
3. 查看控制台日志确认插件加载状态

## 预期效果

安装插件后，您应该看到：

1. 状态栏显示 "👋 Hello Plugin"
2. 左侧活动栏有 👋 图标
3. 点击图标后：
   - 右上角显示通知 "Hello World! 👋"
   - 侧边栏显示 Hello World 内容
   - 编辑器打开 Hello World.md 文件

## 故障排除

如果插件没有正常工作：

1. 检查浏览器控制台是否有错误信息
2. 确认插件是否正确注册在 `PluginSystemService` 中
3. 验证 Molecule 框架是否正确加载

## 扩展开发

基于这个插件，您可以：

1. 修改显示的内容和样式
2. 添加更多的交互功能
3. 集成其他 Molecule API
4. 实现更复杂的插件逻辑

---

这是一个用于学习和验证插件开发流程的示例插件。
