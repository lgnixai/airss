# Obsidian 兼容插件系统

本项目实现了一个兼容 Obsidian 插件 API 的插件系统，允许开发者使用熟悉的 Obsidian 插件开发模式来扩展 Molecule Notes 的功能。

## 🎯 核心目标

- **兼容性**: 支持大部分 Obsidian 插件 API
- **易用性**: 开发者可以使用熟悉的 Obsidian 插件开发模式
- **扩展性**: 支持丰富的插件功能扩展
- **稳定性**: 提供可靠的插件生命周期管理

## 🚀 主要特性

### ✅ 完整的 API 兼容性

- **核心 API**: `app.vault`, `app.workspace`, `app.metadataCache` 等
- **UI API**: `addRibbonIcon()`, `addStatusBarItem()`, `addSettingTab()` 等
- **编辑器 API**: Markdown 后处理器、代码块处理器等
- **命令系统**: 全局命令注册和管理
- **事件系统**: 文件事件、工作区事件等

### ✅ 自动资源管理

- 插件卸载时自动清理事件监听器
- 自动清理定时器和 DOM 事件
- 防止内存泄漏

### ✅ 设置和数据管理

- 插件设置的保存和加载
- 本地存储支持
- 设置界面集成

### ✅ 插件生命周期

- 插件注册和启用
- 依赖检查
- 错误处理和恢复

## 📁 项目结构

```
app/src/
├── core/pluginSystem/
│   ├── PluginManager.ts                    # 传统插件管理器
│   ├── ObsidianCompatiblePluginManager.ts  # Obsidian 兼容插件管理器
│   └── types.ts                           # 类型定义
├── plugins/
│   ├── rss/                               # RSS 插件（传统）
│   └── obsidianExample/                   # Obsidian 示例插件
├── docs/
│   └── obsidian-plugin-guide.md           # 插件开发指南
└── README-OBSIDIAN-PLUGINS.md             # 本文档
```

## 🔧 快速开始

### 1. 创建 Obsidian 兼容插件

```typescript
// src/plugins/my-plugin/MyPlugin.ts
import { Plugin, App, TFile } from '../../core/pluginSystem/ObsidianCompatiblePluginManager';

export class MyPlugin extends Plugin {
  async onload() {
    console.log('My plugin loaded!');
    
    // 添加状态栏项目
    const statusBarItem = this.addStatusBarItem();
    statusBarItem.setText('My Plugin');
    
    // 添加命令
    this.addCommand({
      id: 'my-plugin-hello',
      name: 'Say Hello',
      callback: () => {
        console.log('Hello from my plugin!');
      }
    });
  }
  
  async onunload() {
    console.log('My plugin unloading...');
  }
}
```

### 2. 创建插件清单

```typescript
// src/plugins/my-plugin/manifest.ts
import { IPluginManifest } from '../../core/pluginSystem/types';
import { MyPlugin } from './MyPlugin';

export const myPluginManifest: IPluginManifest = {
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  description: '我的插件描述',
  author: 'Your Name',
  dependencies: [],
  pluginClass: MyPlugin,
  minAppVersion: '1.0.0',
  isDesktopOnly: false
};
```

### 3. 注册插件

```typescript
// 在 PluginSystemService.ts 中
import { myPluginManifest } from '../plugins/my-plugin/manifest';

private async registerObsidianPlugins() {
  await this.obsidianPluginManager.registerObsidianPlugin(
    myPluginManifest, 
    myPluginManifest.pluginClass
  );
}
```

## 📚 API 参考

### 核心 API

#### App 接口

```typescript
interface App {
  vault: Vault;              // 文件库操作
  workspace: Workspace;      // 工作区操作
  metadataCache: MetadataCache; // 元数据缓存
  fileManager: FileManager;  // 文件管理器
  commands: Commands;        // 命令系统
  settings: Settings;        // 设置管理
  storage: Storage;          // 数据存储
  editor: Editor;            // 编辑器操作
}
```

#### 文件系统操作

```typescript
// 读取文件
const content = await this.app.vault.read(file);

// 写入文件
await this.app.vault.write(file, content);

// 创建文件
const newFile = await this.app.vault.create('path/to/file.md', '# Hello World');

// 删除文件
await this.app.vault.delete(file);
```

#### 工作区操作

```typescript
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

### UI API

#### 添加功能区图标

```typescript
const icon = this.addRibbonIcon('star', 'My Plugin', (evt) => {
  console.log('Icon clicked!');
});
```

#### 添加状态栏项目

```typescript
const statusBarItem = this.addStatusBarItem();
statusBarItem.setText('My Plugin Status');
```

#### 添加设置标签页

```typescript
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

this.addSettingTab(new MySettingTab(this.app, this));
```

### 编辑器 API

#### Markdown 后处理器

```typescript
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
```

#### 代码块处理器

```typescript
this.registerMarkdownCodeBlockProcessor('my-language', 
  (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
    // 处理特定语言的代码块
    el.innerHTML = `<div class="my-code-block">${source}</div>`;
  }
);
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

## 🔄 事件管理

### 注册事件

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

## 🛠️ 开发工具

### 调试技巧

1. **控制台日志**
   ```typescript
   console.log('Plugin loaded');
   console.error('Plugin error:', error);
   ```

2. **开发者工具**
   - 使用浏览器开发者工具调试
   - 检查网络请求
   - 查看控制台错误

3. **插件状态检查**
   ```typescript
   if (this.app) {
     console.log('App context available');
   }
   ```

## 📖 示例插件

参考 `src/plugins/obsidianExample/` 目录下的示例插件，了解完整的插件开发流程。

### 示例插件功能

- ✅ 状态栏集成
- ✅ 命令系统
- ✅ 设置界面
- ✅ Markdown 处理
- ✅ 代码块处理
- ✅ 事件监听
- ✅ 数据存储

## 🔗 迁移指南

### 从 Obsidian 插件迁移

1. **复制插件代码** - 将插件文件复制到 `src/plugins/` 目录
2. **修改导入语句** - 更新导入路径
3. **创建清单文件** - 添加 `manifest.ts` 文件
4. **注册插件** - 在 `PluginSystemService` 中注册
5. **测试功能** - 验证插件功能是否正常

### 兼容性检查

- ✅ 大部分 Obsidian API 已实现
- ✅ 插件生命周期管理
- ✅ 事件系统
- ✅ 文件系统操作
- ⚠️ 部分高级功能可能需要适配

## 🚧 限制和注意事项

### 当前限制

1. **部分 API 未实现** - 某些高级 Obsidian API 可能需要进一步实现
2. **UI 差异** - Molecule 的 UI 与 Obsidian 有所不同
3. **文件系统** - 当前使用模拟的文件系统

### 最佳实践

1. **错误处理** - 始终添加适当的错误处理
2. **资源清理** - 使用 `registerEvent()` 等方法自动清理资源
3. **性能优化** - 避免在事件处理器中执行耗时操作
4. **用户体验** - 提供清晰的设置界面和错误提示

## 📄 许可证

本项目遵循 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个插件系统！

## 📞 支持

如果你在使用过程中遇到问题，可以：

1. 查看 [插件开发指南](docs/obsidian-plugin-guide.md)
2. 参考 [示例插件](src/plugins/obsidianExample/)
3. 提交 Issue 描述问题

---

**注意**: 这是一个实验性的功能，API 可能会发生变化。建议在生产环境中使用前充分测试。
