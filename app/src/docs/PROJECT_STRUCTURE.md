# 项目目录结构

## 概述

本项目采用清晰的分层架构，将不同类型的代码和资源按功能模块进行组织。

## 目录结构

```
app/
├── src/                          # 源代码根目录
│   ├── core/                     # 核心系统模块
│   │   ├── pluginSystem/         # 插件系统核心
│   │   │   ├── ObsidianCompatiblePluginManager.ts
│   │   │   └── types.ts
│   │   └── PluginSystemService.ts
│   │
│   ├── plugins/                  # 插件模块
│   │   ├── hello/               # Hello 插件
│   │   │   ├── HelloPlugin.ts
│   │   │   └── manifest.ts
│   │   ├── excalidraw/          # Excalidraw 白板插件
│   │   │   ├── ExcalidrawPlugin.ts
│   │   │   └── manifest.ts
│   │   ├── rss/                 # RSS 阅读器插件
│   │   │   ├── RssPlugin.ts
│   │   │   └── manifest.ts
│   │   ├── aiAssistant/         # AI 助手插件
│   │   ├── markdownEditor/      # Markdown 编辑器插件
│   │   └── obsidianExample/     # Obsidian 示例插件
│   │
│   ├── components/              # 通用组件
│   │   ├── AiChatComponent.tsx
│   │   ├── menuBar.tsx
│   │   └── ...
│   │
│   ├── utils/                   # 工具函数
│   │   └── index.ts
│   │
│   ├── tests/                   # 测试文件
│   │   ├── ai-assistant-test.ts
│   │   ├── automation.ts
│   │   └── ...
│   │
│   ├── scripts/                 # 自动化脚本
│   │   ├── debug-excalidraw.js
│   │   ├── test-excalidraw-plugin.js
│   │   ├── test-hello-functionality.js
│   │   └── ...
│   │
│   └── docs/                    # 项目文档
│       ├── PROJECT_STRUCTURE.md
│       ├── PLUGIN_DEVELOPMENT_STANDARD.md
│       ├── MOLECULE_API_REFERENCE.md
│       └── ...
│
├── public/                      # 静态资源
├── mock/                        # 模拟数据
├── package.json                 # 项目配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
└── index.html                  # 入口 HTML
```

## 模块说明

### core/ - 核心系统模块
- **pluginSystem/**: 插件系统的核心实现
  - `ObsidianCompatiblePluginManager.ts`: Obsidian 兼容的插件管理器
  - `types.ts`: 插件系统类型定义
- **PluginSystemService.ts**: 插件系统服务，负责插件的注册和管理

### plugins/ - 插件模块
每个插件都是一个独立的模块，包含：
- **主插件文件**: 实现插件的主要功能
- **manifest.ts**: 插件清单，定义插件的元数据

#### 当前插件列表
- **hello**: 基础功能验证插件
- **excalidraw**: 专业绘图白板插件
- **rss**: RSS 阅读器插件
- **aiAssistant**: AI 助手插件
- **markdownEditor**: Markdown 编辑器插件
- **obsidianExample**: Obsidian 示例插件

### components/ - 通用组件
可复用的 React 组件，供插件和主应用使用。

### utils/ - 工具函数
通用的工具函数和辅助方法。

### tests/ - 测试文件
单元测试、集成测试等测试文件。

### scripts/ - 自动化脚本
用于开发、测试、调试的自动化脚本。

### docs/ - 项目文档
项目相关的所有文档，包括：
- 开发指南
- API 文档
- 最佳实践
- 故障排除指南

## 设计原则

### 1. 模块化
- 每个功能模块独立，职责清晰
- 插件系统与业务逻辑分离
- 核心功能与扩展功能分离

### 2. 可扩展性
- 插件架构支持动态加载
- 标准化的插件接口
- 易于添加新插件

### 3. 可维护性
- 清晰的目录结构
- 统一的命名规范
- 完善的文档

### 4. 可测试性
- 独立的测试目录
- 自动化测试脚本
- 模拟数据支持

## 开发规范

### 文件命名
- 使用 PascalCase 命名组件文件
- 使用 camelCase 命名工具函数
- 使用 kebab-case 命名文档文件

### 目录命名
- 使用小写字母
- 使用连字符分隔单词
- 保持简洁明了

### 导入路径
- 使用相对路径导入同模块文件
- 使用绝对路径导入跨模块文件
- 避免过深的嵌套路径

## 迁移指南

### 从旧结构迁移
1. 将插件文件移动到 `src/plugins/` 对应目录
2. 更新导入路径
3. 运行测试确保功能正常
4. 更新相关文档

### 添加新插件
1. 在 `src/plugins/` 下创建新目录
2. 实现插件主文件和清单文件
3. 在 `core/PluginSystemService.ts` 中注册插件
4. 添加相应的测试和文档

## 注意事项

1. **保持结构一致性**: 新增文件时遵循现有结构
2. **文档同步**: 代码变更时及时更新文档
3. **测试覆盖**: 新功能需要相应的测试
4. **向后兼容**: 重构时保持 API 兼容性
