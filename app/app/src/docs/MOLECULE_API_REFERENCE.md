# Molecule API 完整参考文档

## 📖 概述

本文档基于 `TestExtension.tsx` 和 `testPane.tsx` 中的实际使用示例，整理了 Molecule 框架的核心 API 使用方法。

## 🏗️ 核心架构

### IMoleculeContext 接口
Molecule 的核心上下文对象，包含所有可用的 API 服务。

```typescript
interface IMoleculeContext {
  // 布局相关
  layout: ILayoutService;
  
  // 主要 UI 组件
  activityBar: IActivityBarService;
  sidebar: ISidebarService;
  auxiliaryBar: IAuxiliaryBarService;
  statusBar: IStatusBarService;
  panel: IPanelService;
  editor: IEditorService;
  
  // 菜单和工具栏
  menuBar: IMenuBarService;
  contextMenu: IContextMenuService;
  
  // 文件系统
  folderTree: IFolderTreeService;
  explorer: IExplorerService;
  search: ISearchService;
  
  // 其他服务
  notification: INotificationService;
  output: IOutputService;
  builtin: IBuiltinService;
}
```

## 🎯 Activity Bar (活动栏) API

### 基本操作

#### 添加活动栏项目
```typescript
// 基本添加
molecule.activityBar.add({
  id: 'unique-id',
  name: '显示名称',
  icon: 'icon-name', // 或 emoji: '👋'
  alignment: 'top', // 'top' | 'bottom'
  sortIndex: 1, // 排序位置
  disabled: false, // 是否禁用
});

// 示例：添加 Hello 插件图标
molecule.activityBar.add({
  id: 'hello-plugin',
  name: 'Hello Plugin',
  icon: '👋',
  sortIndex: 4,
  alignment: 'top',
  onClick: () => {
    console.log('Hello Plugin clicked!');
    // 处理点击事件
  }
});
```

#### 移除活动栏项目
```typescript
molecule.activityBar.remove('unique-id');
```

#### 获取活动栏状态
```typescript
const state = molecule.activityBar.getState();
console.log('活动栏项目数量:', state.data.length);
```

#### 设置活动栏可见性
```typescript
molecule.layout.setActivityBar((prev) => !prev); // 切换显示/隐藏
```

### 事件监听

#### 点击事件
```typescript
molecule.activityBar.onClick((item) => {
  console.log('点击了活动栏项目:', item);
  if (item.id === 'hello-plugin') {
    // 处理特定项目点击
  }
});
```

#### 右键菜单
```typescript
molecule.activityBar.onContextMenu(() => {
  molecule.contextMenu.add([
    { id: 'action1', name: '操作1' },
    { id: 'action2', name: '操作2' },
    { id: 'divider', type: 'divider' },
  ]);
});
```

## 📋 Sidebar (侧边栏) API

### 基本操作

#### 添加侧边栏面板
```typescript
molecule.sidebar.add({
  id: 'unique-panel-id',
  name: '面板名称',
  render: () => <YourComponent />, // React 组件
  sortIndex: 1,
  disabled: false,
});

// 示例：添加插件管理面板
molecule.sidebar.add({
  id: 'pluginManager',
  name: '插件管理',
  render: () => <PluginManager pluginSystem={pluginSystem} />,
});
```

#### 移除侧边栏面板
```typescript
molecule.sidebar.remove('unique-panel-id');
```

#### 设置加载状态
```typescript
molecule.sidebar.setLoading((prev) => !prev); // 切换加载状态
```

#### 更新工具栏
```typescript
molecule.sidebar.updateToolbar('explorer', {
  id: 'workspace',
  name: '工作区',
});
```

## 🔧 Status Bar (状态栏) API

### 基本操作

#### 添加状态栏项目
```typescript
molecule.statusBar.add({
  id: 'unique-status-id',
  name: '状态名称',
  sortIndex: 1,
  alignment: 'left', // 'left' | 'right'
  disabled: false,
  render: () => <div>自定义内容</div>, // 可选的自定义渲染
});

// 示例：添加简单的状态项
molecule.statusBar.add({
  id: 'hello-status',
  name: 'Hello Plugin Status',
  sortIndex: 2,
  alignment: 'right',
});
```

#### 移除状态栏项目
```typescript
molecule.statusBar.remove('unique-status-id');
```

#### 获取状态栏数据
```typescript
const data = molecule.statusBar.getState().data;
if (data.length) {
  molecule.statusBar.remove(data.at(-1)!.id); // 移除最后一个
}
```

#### 设置状态栏可见性
```typescript
molecule.layout.setStatusBar((prev) => !prev); // 切换显示/隐藏
```

## 📝 Editor (编辑器) API

### 基本操作

#### 打开文件/标签页
```typescript
molecule.editor.open({
  id: 'unique-tab-id',
  name: '文件名.txt',
  icon: 'file',
  value: '文件内容',
  language: 'typescript', // 语言类型
  breadcrumb: [
    { id: 'folder1', name: '文件夹1' },
    { id: 'file1', name: '文件名.txt' }
  ],
}, groupId); // 可选的组ID

// 示例：打开 RSS 文章
molecule.editor.open({
  id: article.id,
  name: article.name,
  value: article.content,
  language: 'markdown',
  icon: 'file'
});
```

#### 获取当前编辑器组
```typescript
const currentGroup = molecule.editor.getCurrentGroup();
if (currentGroup && currentGroup.editorInstance) {
  const model = currentGroup.editorInstance.getModel();
  if (model) {
    const content = model.getValue(); // 获取编辑器内容
  }
}
```

#### 获取标签页
```typescript
const tab = molecule.editor.getTab(tabId, groupId);
```

#### 更新标签页
```typescript
molecule.editor.updateTab({
  id: tabId,
  name: '新名称',
  icon: 'new-icon',
  value: '新内容',
}, groupId);
```

#### 设置当前标签页
```typescript
molecule.editor.setCurrent(tabId, groupId);
```

#### 关闭标签页
```typescript
molecule.editor.close(tabId, groupId);
```

### 编辑器状态管理

#### 设置加载状态
```typescript
molecule.editor.setLoading(true); // 显示加载状态
molecule.editor.setLoading(false); // 隐藏加载状态
```

#### 更新编辑器选项
```typescript
molecule.editor.updateOptions({
  readOnly: true, // 设置为只读
});
```

#### 设置欢迎页面
```typescript
molecule.editor.setEntry(<div>欢迎使用 Molecule!</div>);
```

### 事件监听

#### 标签页切换
```typescript
molecule.editor.onSelectTab((tabId, groupId) => {
  console.log('切换到标签页:', tabId);
  // 更新当前内容缓存
  updateCurrentTabContent(tabId, groupId);
});
```

#### 标签页关闭
```typescript
molecule.editor.onClose((tabs) => {
  console.log('关闭了', tabs.length, '个标签页');
  molecule.notification.add({
    id: `close_tab_${Date.now()}`,
    value: `关闭了 ${tabs.length} 个标签页`,
  });
});
```

#### 当前标签页变化
```typescript
molecule.editor.onCurrentChange((prev, next) => {
  if (next.tabId) {
    molecule.folderTree.setCurrent(next.tabId);
  }
});
```

## 🌳 Folder Tree (文件夹树) API

### 基本操作

#### 添加根文件夹
```typescript
getWorkspace().then((tree) => {
  molecule.folderTree.add(tree);
  molecule.explorer.update({
    id: molecule.builtin.getConstants().EXPLORER_ITEM_WORKSPACE,
    name: tree.name,
  });
});
```

#### 加载文件夹内容
```typescript
molecule.folderTree.onLoad((id) => {
  molecule.folderTree.addLoading(id);
  getFiles(id as string)
    .then(([folder, files]) => {
      molecule.folderTree.update({
        id,
        children: [...folder, ...files],
      });
    })
    .finally(() => {
      molecule.folderTree.removeLoading(id);
    });
});
```

### 事件监听

#### 文件夹选择
```typescript
molecule.folderTree.onSelect((treeNode) => {
  if (treeNode.fileType === 'File') {
    openFile(treeNode);
  }
});
```

#### 文件夹重命名
```typescript
molecule.folderTree.onRename((ele, treeNode) => {
  const value = ele.value;
  if (!value) {
    ele.focus();
    molecule.folderTree.setValidateInfo({
      status: 'error',
      message: `必须提供${treeNode.fileType === 'File' ? '文件' : '文件夹'}名`,
    });
    return false;
  }
});
```

#### 右键菜单
```typescript
molecule.folderTree.onContextMenu((_, treeNode) => {
  if (treeNode.fileType === FileTypes.File) {
    molecule.contextMenu.add([
      { id: 'open', name: '打开文件' },
      { id: 'divider', type: 'divider' },
    ]);
  }
});
```

#### 拖拽操作
```typescript
molecule.folderTree.onDrop((source, target) => {
  molecule.folderTree.drop(source.id, target.id);
});
```

## 🔍 Search (搜索) API

### 基本操作

#### 设置搜索结果
```typescript
molecule.search.setResult([
  {
    id: 'result1',
    filename: 'file1.txt',
    data: '匹配的内容',
    path: '/path/to/file1.txt',
    lineNumber: 10,
  }
], 1);
```

#### 展开所有结果
```typescript
molecule.search.expandAll();
```

### 事件监听

#### 搜索输入
```typescript
molecule.search.onSearch(debounce((value) => {
  if (!value) {
    molecule.search.setResult([], 0);
    return;
  }
  // 执行搜索逻辑
  searchFileContents(value).then((data) => {
    molecule.search.setResult(data.map(item => ({
      id: `${item.filename}_${item.startline}`,
      filename: item.filename,
      data: item.data,
      path: item.path,
      lineNumber: item.startline,
    })), data.length);
  });
}, 1000));
```

#### 选择搜索结果
```typescript
molecule.search.onSelect((treeNode) => {
  if (treeNode.fileType === 'File') {
    openFile({ id: treeNode.id, name: treeNode.name });
  }
});
```

## 📢 Notification (通知) API

### 基本操作

#### 添加通知
```typescript
molecule.notification.add({
  id: 'unique-notification-id',
  value: '通知内容',
  type: 'info', // 'info' | 'warning' | 'error' | 'success'
});
```

#### 打开通知
```typescript
molecule.notification.open({
  id: 'unique-notification-id',
  value: '通知内容',
});
```

#### 设置通知可见性
```typescript
molecule.layout.setNotification(true); // 显示通知
molecule.layout.setNotification(false); // 隐藏通知
```

## 🎛️ Layout (布局) API

### 基本操作

#### 设置各个面板的可见性
```typescript
// 活动栏
molecule.layout.setActivityBar((prev) => !prev);

// 侧边栏
molecule.layout.setSidebar((prev) => !prev);

// 状态栏
molecule.layout.setStatusBar((prev) => !prev);

// 面板
molecule.layout.setPanel((prev) => !prev);

// 菜单栏
molecule.layout.setMenuBar((prev) => !prev);

// 辅助栏
molecule.layout.setAuxiliaryBar(true);
```

## 🍽️ Menu Bar (菜单栏) API

### 基本操作

#### 添加菜单
```typescript
molecule.menuBar.add({
  id: 'menu-item-id',
  name: '菜单项名称',
  icon: 'icon-name',
}, 'parent-menu-id'); // 可选的父菜单ID
```

#### 移除菜单
```typescript
molecule.menuBar.remove('menu-item-id');
```

#### 更新菜单
```typescript
molecule.menuBar.update({
  id: 'menu-item-id',
  icon: 'new-icon',
  disabled: true,
});
```

#### 获取菜单
```typescript
const menu = molecule.menuBar.get('menu-item-id');
```

### 事件监听

#### 菜单选择
```typescript
molecule.menuBar.onSelect((menuId) => {
  if (menuId === molecule.builtin.getConstants().MENUBAR_ITEM_ABOUT) {
    window.open('https://github.com/DTStack/molecule', '_blank');
  }
});
```

## 🎯 Context Menu (右键菜单) API

### 基本操作

#### 添加右键菜单项
```typescript
molecule.contextMenu.add([
  { id: 'action1', name: '操作1' },
  { id: 'action2', name: '操作2', disabled: true },
  { id: 'divider', type: 'divider' },
]);
```

### 事件监听

#### 右键菜单点击
```typescript
molecule.contextMenu.onClick((item) => {
  if (item.id === 'action1') {
    // 处理操作1
  }
});
```

## 🔧 Auxiliary Bar (辅助栏) API

### 基本操作

#### 添加辅助栏项目
```typescript
molecule.auxiliaryBar.add({
  id: 'unique-auxiliary-id',
  name: '辅助栏名称',
  icon: 'icon-name',
  render: () => <YourComponent />, // React 组件
});
```

#### 设置当前辅助栏
```typescript
molecule.auxiliaryBar.setCurrent('unique-auxiliary-id');
```

## 📊 Panel (面板) API

### 基本操作

#### 打开面板
```typescript
molecule.panel.open({
  id: 'unique-panel-id',
  name: '面板名称',
  closable: true,
  disabled: false,
  sortIndex: 1,
  render: () => <div>面板内容</div>,
});
```

#### 设置当前面板
```typescript
molecule.panel.setCurrent('unique-panel-id');
```

## 📤 Output (输出) API

### 基本操作

#### 追加输出内容
```typescript
molecule.output.append('输出内容\n');
```

#### 清空输出
```typescript
molecule.output.clear();
```

## 🏗️ Builtin (内置) API

### 获取常量
```typescript
const constants = molecule.builtin.getConstants();
console.log('EXPLORER_ITEM_WORKSPACE:', constants.EXPLORER_ITEM_WORKSPACE);
console.log('SIDEBAR_ITEM_EXPLORER:', constants.SIDEBAR_ITEM_EXPLORER);
console.log('MENUBAR_ITEM_ABOUT:', constants.MENUBAR_ITEM_ABOUT);
```

## 🎨 最佳实践

### 1. 错误处理
```typescript
try {
  molecule.activityBar.add({
    id: 'hello-plugin',
    name: 'Hello Plugin',
    icon: '👋',
    sortIndex: 4,
    alignment: 'top',
    onClick: () => {
      console.log('Hello Plugin clicked!');
    }
  });
  console.log('✅ Activity bar item added successfully');
} catch (error) {
  console.error('❌ Failed to add activity bar item:', error);
  // 回退到其他实现方式
}
```

### 2. 状态检查
```typescript
// 检查 API 是否可用
if (molecule && molecule.activityBar) {
  // 使用 API
} else {
  console.warn('Molecule API not available');
}
```

### 3. 延迟初始化
```typescript
// 延迟初始化插件系统，确保 Molecule 完全加载
setTimeout(() => {
  try {
    console.log('Starting plugin system initialization...');
    pluginSystem = new PluginSystemService(molecule);
    pluginSystem.initialize().then(() => {
      console.log('Plugin system initialized successfully');
    });
  } catch (error) {
    console.error('Failed to create plugin system:', error);
  }
}, 2000);
```

### 4. 事件清理
```typescript
// 在组件卸载时清理事件监听器
useEffect(() => {
  const handleSelect = (tabId: any, groupId: any) => {
    // 处理事件
  };
  
  molecule.editor.onSelectTab(handleSelect);
  
  return () => {
    // 清理事件监听器（如果 API 支持）
    molecule.editor.offSelectTab?.(handleSelect);
  };
}, []);
```

## 📚 常用图标

Molecule 支持多种图标类型：

### Emoji 图标
```typescript
icon: '👋' // Hello 插件
icon: '📡' // RSS 插件
icon: '🔬' // 实验/测试
icon: '🧩' // 插件管理
```

### 内置图标
```typescript
icon: 'file' // 文件
icon: 'edit' // 编辑
icon: 'account' // 账户
icon: 'beaker' // 实验
icon: 'puzzle' // 拼图
icon: 'lightbulb' // 灯泡
icon: 'play' // 播放
icon: 'loading~spin' // 加载动画
```

## 🔗 相关资源

- [Molecule 官方文档](https://github.com/DTStack/molecule)
- [TestExtension.tsx](./src/extensions/TestExtension.tsx) - 完整的使用示例
- [testPane.tsx](./src/components/testPane.tsx) - UI 操作示例

---

**注意**: 本文档基于实际代码分析，如有 API 变更，请参考最新的官方文档。
