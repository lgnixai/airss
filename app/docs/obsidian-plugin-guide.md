# Obsidian 兼容插件开发指南

本文档介绍如何在 Molecule Notes 中开发 Obsidian 兼容的插件。

## 概述

Molecule Notes 现在支持两种插件系统：

1. **传统插件系统** - 基于 Molecule 框架的插件系统
2. **Obsidian 兼容插件系统** - 兼容 Obsidian 插件 API 的插件系统

## Obsidian 兼容插件系统特性

### 核心特性

- ✅ **完整的 Obsidian API 兼容性** - 支持大部分 Obsidian 插件 API
- ✅ **自动资源管理** - 插件卸载时自动清理事件监听器和定时器
- ✅ **设置管理** - 支持插件设置的保存和加载
- ✅ **命令系统** - 支持全局命令注册
- ✅ **Markdown 处理** - 支持 Markdown 后处理器和代码块处理器
- ✅ **文件系统操作** - 支持文件读写、创建、删除等操作
- ✅ **事件系统** - 支持文件打开、关闭等事件监听

### 支持的 API

#### 核心 API
- `app.vault` - 文件库操作
- `app.workspace` - 工作区操作
- `app.metadataCache` - 元数据缓存
- `app.fileManager` - 文件管理器
- `app.commands` - 命令系统
- `app.settings` - 设置管理
- `app.storage` - 数据存储

#### UI API
- `addRibbonIcon()` - 添加功能区图标
- `addStatusBarItem()` - 添加状态栏项目
- `addSettingTab()` - 添加设置标签页

#### 编辑器 API
- `registerMarkdownPostProcessor()` - 注册 Markdown 后处理器
- `registerMarkdownCodeBlockProcessor()` - 注册代码块处理器
- `registerEditorExtension()` - 注册编辑器扩展

## 创建 Obsidian 兼容插件

### 1. 插件结构

```
src/plugins/your-plugin/
├── YourPlugin.ts          # 插件主文件
├── manifest.ts            # 插件清单
└── README.md              # 插件说明
```

### 2. 插件主文件

```typescript
import { Plugin, App, TFile } from '../../core/pluginSystem/ObsidianCompatiblePluginManager';

export class YourPlugin extends Plugin {
  async onload() {
    console.log('Your plugin loaded!');
    
    // 添加状态栏项目
    const statusBarItem = this.addStatusBarItem();
    statusBarItem.setText('Your Plugin');
    
    // 添加命令
    this.addCommand({
      id: 'your-plugin-hello',
      name: 'Say Hello',
      callback: () => {
        console.log('Hello from your plugin!');
      }
    });
    
    // 监听文件打开事件
    this.registerEvent(
      this.app.workspace.onFileOpen((file: TFile) => {
        console.log('File opened:', file.path);
      })
    );
    
    // 保存插件数据
    await this.saveData({
      lastLoadTime: new Date().toISOString()
    });
  }
  
  async onunload() {
    console.log('Your plugin unloading...');
    // 清理资源
  }
}
```

### 3. 插件清单

```typescript
import { IPluginManifest } from '../../core/pluginSystem/types';
import { YourPlugin } from './YourPlugin';

export const yourPluginManifest: IPluginManifest = {
  id: 'your-plugin',
  name: 'Your Plugin',
  version: '1.0.0',
  description: '你的插件描述',
  author: 'Your Name',
  dependencies: [],
  pluginClass: YourPlugin,
  minAppVersion: '1.0.0',
  isDesktopOnly: false
};
```

### 4. 注册插件

在 `PluginSystemService.ts` 中注册你的插件：

```typescript
import { yourPluginManifest } from '../plugins/your-plugin/manifest';

private async registerObsidianPlugins() {
  // 注册你的插件
  await this.obsidianPluginManager.registerObsidianPlugin(
    yourPluginManifest, 
    yourPluginManifest.pluginClass
  );
}
```

## API 详细说明

### 文件系统操作

```typescript
// 读取文件
const content = await this.app.vault.read(file);

// 写入文件
await this.app.vault.write(file, content);

// 创建文件
const newFile = await this.app.vault.create('path/to/file.md', '# Hello World');

// 删除文件
await this.app.vault.delete(file);

// 重命名文件
await this.app.vault.rename(file, 'new-name.md');
```

### 工作区操作

```typescript
// 监听布局就绪
this.app.workspace.onLayoutReady(() => {
  console.log('Layout is ready');
});

// 监听文件打开
this.registerEvent(
  this.app.workspace.onFileOpen((file: TFile) => {
    console.log('File opened:', file.path);
  })
);

// 获取当前活动文件
const activeFile = this.app.workspace.getActiveFile();

// 打开文件
await this.app.workspace.openFile(file);
```

### 命令系统

```typescript
// 添加命令
this.addCommand({
  id: 'my-command',
  name: 'My Command',
  callback: () => {
    console.log('Command executed');
  },
  hotkeys: [
    { modifiers: ['Ctrl'], key: 'Shift+A' }
  ]
});

// 移除命令
this.removeCommand('my-command');
```

### 设置管理

```typescript
// 创建设置标签页
class MySettingTab {
  public id: string = 'my-settings';
  public name: string = 'My Plugin';
  public tab: HTMLElement;

  constructor(app: App, plugin: Plugin) {
    this.tab = this.createSettingsTab();
  }

  private createSettingsTab(): HTMLElement {
    const container = document.createElement('div');
    // 创建设置界面
    return container;
  }
}

// 添加设置标签页
this.addSettingTab(new MySettingTab(this.app, this));
```

### Markdown 处理

```typescript
// 注册 Markdown 后处理器
this.registerMarkdownPostProcessor({
  type: 'markdown',
  process: (element: HTMLElement, context: MarkdownPostProcessorContext) => {
    // 处理 Markdown 内容
    const headings = element.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
      // 修改标题
    });
  }
});

// 注册代码块处理器
this.registerMarkdownCodeBlockProcessor('my-language', 
  (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
    // 处理特定语言的代码块
    el.innerHTML = `<div class="my-code-block">${source}</div>`;
  }
);
```

### 数据存储

```typescript
// 保存数据
await this.saveData({
  setting1: 'value1',
  setting2: 'value2'
});

// 加载数据
const data = await this.loadData();
console.log(data.setting1);
```

### 事件管理

```typescript
// 注册 DOM 事件
this.registerDomEvent(element, 'click', (evt) => {
  console.log('Element clicked');
});

// 注册定时器
this.registerInterval(setInterval(() => {
  console.log('Timer tick');
}, 1000));

// 注册应用事件
this.registerEvent(
  this.app.workspace.onFileOpen((file) => {
    console.log('File opened:', file.path);
  })
);
```

## 最佳实践

### 1. 资源管理

- 使用 `registerEvent()` 注册事件，插件卸载时会自动清理
- 使用 `registerDomEvent()` 注册 DOM 事件
- 使用 `registerInterval()` 注册定时器
- 在 `onunload()` 中清理手动创建的资源

### 2. 错误处理

```typescript
async onload() {
  try {
    // 插件初始化代码
  } catch (error) {
    console.error('Plugin initialization failed:', error);
  }
}
```

### 3. 性能优化

- 避免在事件处理器中执行耗时操作
- 使用防抖和节流处理频繁触发的事件
- 合理使用缓存减少重复计算

### 4. 用户体验

- 提供清晰的设置界面
- 添加适当的错误提示
- 支持键盘快捷键
- 提供状态反馈

## 调试技巧

### 1. 控制台日志

```typescript
console.log('Plugin loaded');
console.error('Plugin error:', error);
```

### 2. 开发者工具

- 使用浏览器开发者工具调试
- 检查网络请求
- 查看控制台错误

### 3. 插件状态检查

```typescript
// 检查插件是否正常加载
if (this.app) {
  console.log('App context available');
}
```

## 迁移现有 Obsidian 插件

如果你有现有的 Obsidian 插件，可以按以下步骤迁移：

1. **复制插件代码** - 将插件文件复制到 `src/plugins/` 目录
2. **修改导入语句** - 更新导入路径
3. **创建清单文件** - 添加 `manifest.ts` 文件
4. **注册插件** - 在 `PluginSystemService` 中注册
5. **测试功能** - 验证插件功能是否正常

## 示例插件

参考 `src/plugins/obsidianExample/` 目录下的示例插件，了解完整的插件开发流程。

## 常见问题

### Q: 插件无法加载怎么办？

A: 检查以下几点：
- 插件清单文件是否正确
- 插件类是否正确继承 `Plugin`
- 控制台是否有错误信息

### Q: 如何调试插件？

A: 使用浏览器开发者工具：
- 查看控制台日志
- 检查网络请求
- 调试 JavaScript 代码

### Q: 插件数据如何持久化？

A: 使用 `saveData()` 和 `loadData()` 方法：
```typescript
await this.saveData({ key: 'value' });
const data = await this.loadData();
```

## 更多资源

- [Obsidian API 文档](https://docs.obsidian.md/)
- [Molecule 框架文档](https://dtstack.github.io/molecule/)
- [示例插件代码](src/plugins/obsidianExample/)
