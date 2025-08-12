# Hello 插件开发指南

## 🎯 概述

Hello 插件是一个简单的验证插件，用于演示如何在 Molecule Notes 中开发 Obsidian 兼容的插件。这个插件展示了插件开发的核心概念和基本流程。

## 📁 插件结构

```
app/src/plugins/hello/
├── HelloPlugin.ts    # 插件主文件
├── manifest.ts       # 插件清单
└── README.md         # 插件说明文档
```

## 🚀 功能特性

### 核心功能
- ✅ **状态栏集成**: 在状态栏显示 "👋 Hello Plugin"
- ✅ **功能区图标**: 左侧活动栏显示 👋 图标
- ✅ **点击触发**: 点击图标后显示 Hello World
- ✅ **侧边栏显示**: 在侧边栏显示格式化的 Hello World 内容
- ✅ **编辑器集成**: 在编辑器中打开 Hello World.md 文件
- ✅ **通知系统**: 显示友好的通知消息
- ✅ **命令支持**: 支持通过命令面板调用

### 技术验证
- ✅ **插件生命周期**: `onload` 和 `onunload` 方法
- ✅ **Obsidian API**: 使用 Obsidian 兼容的 API
- ✅ **Molecule 集成**: 与 Molecule 框架的集成
- ✅ **事件处理**: 点击事件和回调函数
- ✅ **数据存储**: 插件数据的保存和加载

## 🔧 开发流程

### 1. 创建插件文件

#### HelloPlugin.ts
```typescript
import { Plugin, App, TFile } from '../../core/pluginSystem/ObsidianCompatiblePluginManager';

export class HelloPlugin extends Plugin {
  async onload() {
    // 插件初始化代码
    this.statusBarItem = this.addStatusBarItem();
    this.statusBarItem.setText('👋 Hello Plugin');
    
    this.ribbonIcon = this.addRibbonIcon('👋', 'Hello Plugin', (evt) => {
      this.showHelloWorld();
    });
  }
  
  async onunload() {
    // 插件清理代码
  }
}
```

#### manifest.ts
```typescript
export const helloPluginManifest: IPluginManifest = {
  id: 'hello-plugin',
  name: 'Hello Plugin',
  version: '1.0.0',
  description: '一个简单的 Hello World 插件',
  author: 'Molecule Team',
  dependencies: [],
  pluginClass: HelloPlugin,
  minAppVersion: '1.0.0',
  isDesktopOnly: false
};
```

### 2. 注册插件

在 `PluginSystemService.ts` 中注册插件：

```typescript
import { helloPluginManifest } from '../plugins/hello/manifest';

private async registerObsidianPlugins() {
  await this.obsidianPluginManager.registerObsidianPlugin(
    helloPluginManifest, 
    helloPluginManifest.pluginClass
  );
}
```

### 3. 编译和测试

```bash
# 编译项目
npm run build

# 启动开发服务器
npm run web
```

## 🎮 使用方法

### 安装后效果

1. **状态栏**: 底部状态栏显示 "👋 Hello Plugin"
2. **活动栏**: 左侧活动栏有 👋 图标
3. **点击图标**: 触发 Hello World 功能

### 点击后的效果

1. **通知**: 右上角显示 "Hello World! 👋" 通知
2. **侧边栏**: 显示格式化的 Hello World 内容，包括：
   - 标题和描述
   - 功能列表
   - 时间戳
3. **编辑器**: 打开 Hello World.md 文件，包含：
   - Markdown 格式的内容
   - 功能说明
   - 技术实现说明

## 🧪 测试验证

### 自动测试

项目包含自动测试脚本 `test-hello-plugin.ts`，会验证：

- ✅ 插件加载状态
- ✅ 状态栏显示
- ✅ 功能区图标
- ✅ 点击功能
- ✅ 侧边栏内容
- ✅ 编辑器内容

### 手动测试

1. 打开浏览器开发者工具
2. 查看控制台日志，确认插件加载
3. 点击 👋 图标
4. 观察侧边栏和编辑器的变化
5. 检查通知消息

## 🔍 代码解析

### 核心方法

#### `onload()` - 插件初始化
```typescript
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
```

#### `showHelloWorld()` - 主要功能
```typescript
private showHelloWorld() {
  // 显示通知
  this.showNotice('Hello World! 👋');
  
  // 在侧边栏显示内容
  this.showHelloInSidebar();
  
  // 在编辑器中显示内容
  this.showHelloInEditor();
}
```

#### `showHelloInSidebar()` - 侧边栏集成
```typescript
private showHelloInSidebar() {
  if (this.app.molecule && this.app.molecule.sidebar) {
    this.app.molecule.sidebar.add({
      id: 'hello-sidebar',
      name: 'Hello World',
      render: () => {
        // 创建侧边栏内容
        const container = document.createElement('div');
        // ... 添加内容和样式
        return container;
      }
    });
    
    this.app.molecule.sidebar.setCurrent('hello-sidebar');
  }
}
```

#### `showHelloInEditor()` - 编辑器集成
```typescript
private showHelloInEditor() {
  const content = `# 👋 Hello World!
  欢迎使用 Hello 插件！
  ...`;
  
  if (this.app.molecule && this.app.molecule.editor) {
    this.app.molecule.editor.open({
      id: 'hello-world',
      name: 'Hello World.md',
      value: content,
      language: 'markdown',
      icon: 'file'
    });
  }
}
```

## 🎯 学习要点

### 1. 插件生命周期
- `onload()`: 插件加载时调用，用于初始化
- `onunload()`: 插件卸载时调用，用于清理资源

### 2. Obsidian API 使用
- `addStatusBarItem()`: 添加状态栏项目
- `addRibbonIcon()`: 添加功能区图标
- `addCommand()`: 添加全局命令
- `saveData()` / `loadData()`: 数据存储

### 3. Molecule 框架集成
- `this.app.molecule.sidebar`: 侧边栏操作
- `this.app.molecule.editor`: 编辑器操作
- 事件处理和状态管理

### 4. UI 组件创建
- DOM 元素创建和样式设置
- 事件监听和回调处理
- 动态内容渲染

## 🚧 故障排除

### 常见问题

1. **插件未加载**
   - 检查控制台是否有错误信息
   - 确认插件是否正确注册
   - 验证 TypeScript 编译是否成功

2. **图标不显示**
   - 检查 `addRibbonIcon` 调用
   - 确认图标字符是否正确
   - 验证 CSS 样式是否被覆盖

3. **点击无反应**
   - 检查事件监听器是否正确绑定
   - 确认回调函数是否被调用
   - 验证 Molecule API 是否可用

4. **侧边栏/编辑器不显示**
   - 检查 Molecule 框架是否正确加载
   - 确认 API 调用是否成功
   - 验证 DOM 元素是否正确创建

### 调试技巧

1. **控制台日志**
   ```typescript
   console.log('Hello Plugin loaded!');
   console.log('Showing Hello World...');
   ```

2. **错误处理**
   ```typescript
   try {
     // 插件代码
   } catch (error) {
     console.error('Plugin error:', error);
   }
   ```

3. **状态检查**
   ```typescript
   if (this.app.molecule && this.app.molecule.sidebar) {
     // 使用 API
   } else {
     console.log('Molecule API not available');
   }
   ```

## 🔮 扩展开发

基于这个 Hello 插件，您可以：

1. **修改显示内容**: 更改 Hello World 文本和样式
2. **添加更多功能**: 增加新的交互功能
3. **集成其他 API**: 使用更多的 Molecule 功能
4. **优化用户体验**: 改进 UI 和交互设计

## 📚 相关资源

- [Obsidian 插件开发指南](docs/obsidian-plugin-guide.md)
- [Obsidian 兼容插件系统说明](README-OBSIDIAN-PLUGINS.md)
- [实现总结文档](IMPLEMENTATION_SUMMARY.md)
- [示例插件代码](src/plugins/obsidianExample/)

---

这个 Hello 插件是学习和验证插件开发流程的完美起点！
