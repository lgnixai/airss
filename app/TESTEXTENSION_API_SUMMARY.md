# TestExtension API 使用总结

## 📖 概述

本文档总结了 `TestExtension.tsx` 中所有 Molecule API 的实际使用方法和模式，作为开发插件时的参考。

## 🎯 核心使用模式

### 1. 扩展定义
```typescript
export const TestExtension: IExtension = {
    id: 'TestExtension',
    name: 'TestExtension',
    contributes: {
        [IContributeType.Modules]: {
            menuBar: import('../components/menuBar'),
        },
        [IContributeType.Grammar]: grammars,
    },
    activate(molecule: IMoleculeContext, monaco) {
        // 扩展激活逻辑
    },
};
```

### 2. 延迟初始化模式
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
}, 2000); // 2秒延迟
```

## 🎯 Activity Bar (活动栏) 使用

### 添加活动栏项目
```typescript
// 基本活动栏项目
molecule.activityBar.add({
    id: 'testPane',
    name: 'testPane',
    alignment: 'top',
    sortIndex: 2,
    icon: 'beaker',
});

// 插件管理活动栏项目
molecule.activityBar.add({
    id: 'pluginManager',
    name: '插件管理',
    alignment: 'top',
    sortIndex: 3,
    icon: 'puzzle',
});
```

### 活动栏事件监听
```typescript
// 右键菜单
molecule.activityBar.onContextMenu(() => {
    molecule.contextMenu.add([
        { id: 'testPane__activityBar__molecule', name: 'Molecule' },
        {
            id: 'testPane__activityBar__molecule--disabled',
            name: 'disabled',
            disabled: true,
        },
        { id: '2', type: 'divider' },
    ]);
});
```

## 📋 Sidebar (侧边栏) 使用

### 添加侧边栏面板
```typescript
// 立即添加面板
molecule.sidebar.add({
    id: 'testPane',
    name: 'testPane',
    render: () => <TestPane context={molecule} />,
});

// 延迟添加面板（确保依赖已初始化）
setTimeout(() => {
    molecule.sidebar.add({
        id: 'pluginManager',
        name: '插件管理',
        render: () => <PluginManager pluginSystem={pluginSystem} />,
    });
}, 3000); // 3秒延迟
```

### 侧边栏加载状态
```typescript
// 设置加载状态
molecule.sidebar.setLoading(true);

// 搜索完成后清除加载状态
searchFileContents(value)
    .then((data) => {
        // 处理搜索结果
    })
    .finally(() => {
        molecule.sidebar.setLoading(false);
    });
```

## 🔧 Auxiliary Bar (辅助栏) 使用

### 添加辅助栏项目
```typescript
// 延迟添加 AI 助手到辅助栏
setTimeout(() => {
    try {
        molecule.auxiliaryBar.add({
            id: 'ai-assistant',
            name: 'AI 助手',
            icon: 'lightbulb',
            render: () => {
                return React.createElement(AiChatComponent, {
                    onSendMessage: handleChatMessage,
                    onAiAction: handleAiAction,
                    currentArticle: currentArticle
                });
            }
        });
        
        // 设置为当前激活的辅助栏
        molecule.auxiliaryBar.setCurrent('ai-assistant');
        
        console.log('AI Assistant added to auxiliary bar via Molecule API');
    } catch (error) {
        console.error('Failed to add AI Assistant via Molecule API:', error);
    }
}, 2000);
```

### 设置辅助栏可见性
```typescript
// 默认显示辅助栏
molecule.layout.setAuxiliaryBar(true);
```

## 📝 Editor (编辑器) 使用

### 打开文件
```typescript
function openFile(treeNode: any) {
    molecule.editor.setLoading(true);
    getFileContent(treeNode.id as string)
        .then((data) => {
            const tabData = {
                id: treeNode.id,
                name: treeNode.name,
                icon: treeNode.icon || 'file',
                value: data,
                language: (() => {
                    const name = treeNode.name;
                    if (typeof name !== 'string') return 'plain';
                    if (name.endsWith('.md')) return 'markdown';
                    if (name.endsWith('.yml')) return 'yml';
                    if (name.endsWith('.js')) return 'javascript';
                    if (name.endsWith('.ts')) return 'typescript';
                    if (name.endsWith('.tsx')) return 'typescriptreact';
                    if (name.endsWith('.json')) return 'json';
                    if (name.endsWith('.scss')) return 'css';
                    if (name.endsWith('.html')) return 'html';
                    return 'plain';
                })(),
                breadcrumb: (treeNode.id as string)
                    .split('/')
                    .filter(Boolean)
                    .map((i) => ({ id: i, name: i })),
            };
            molecule.editor.open(tabData, molecule.editor.getState().groups?.at(0)?.id);
        })
        .catch((err) => {
            molecule.layout.setNotification(true);
            molecule.notification.add({
                id: `getFileContent_${treeNode.id}`,
                value: err.message,
            });
        })
        .finally(() => {
            molecule.editor.setLoading(false);
        });
}
```

### 编辑器事件监听
```typescript
// 标签页关闭事件
molecule.editor.onClose((tabs) => {
    molecule.notification.open({
        id: `close_tab_${new Date().valueOf()}`,
        value: `关闭了 ${tabs.length} 个 tab`,
    });
});

// 当前标签页变化事件
molecule.editor.onCurrentChange((_, next) => {
    if (next.tabId) {
        molecule.folderTree.setCurrent(next.tabId);
    }
});

// 标签页选择事件
molecule.editor.onSelectTab((tabId: any, groupId: any) => {
    updateCurrentTabContent(tabId, groupId);
});
```

### 获取编辑器内容
```typescript
// 获取当前编辑器组
const currentGroup = molecule.editor.getCurrentGroup();
if (currentGroup && currentGroup.editorInstance) {
    const model = currentGroup.editorInstance.getModel();
    if (model) {
        const content = model.getValue(); // 获取编辑器内容
    }
}

// 更新当前标签页内容
function updateCurrentTabContent(tabId: any, groupId: any) {
    try {
        const tab = molecule.editor.getTab(tabId, groupId);
        if (tab && tab.value) {
            currentTabContent = typeof tab.value === 'string' ? tab.value : JSON.stringify(tab.value);
            console.log('Updated current tab content, length:', currentTabContent.length);
        }
    } catch (error) {
        console.error('Failed to update current tab content:', error);
    }
}
```

## 🌳 Folder Tree (文件夹树) 使用

### 文件夹树事件监听
```typescript
// 重命名事件
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

// 选择事件
molecule.folderTree.onSelect((treeNode) => {
    const group = molecule.editor.getGroups().find((group) => {
        const tab = molecule.editor.getTab(treeNode.id, group.id);
        return !!tab;
    });
    if (group) {
        const tab = molecule.editor.getTab(treeNode.id, group.id)!;
        molecule.editor.setCurrent(tab.id, group.id);
    } else if (treeNode.fileType === 'File') {
        openFile(treeNode);
    }
});

// 加载事件
molecule.folderTree.onLoad((id) => {
    molecule.folderTree.addLoading(id);
    getFiles(id as string)
        .then(([folder, files]) => {
            molecule.folderTree.update({
                id,
                children: [...folder, ...files],
            });
        })
        .catch((err) => {
            molecule.layout.setNotification(true);
            molecule.notification.add({
                id: `getFiles${id}`,
                value: err.message,
            });
        })
        .finally(() => {
            molecule.folderTree.removeLoading(id);
        });
});

// 创建根文件夹事件
molecule.folderTree.onCreateRoot(() => {
    getWorkspace().then((tree) => {
        molecule.folderTree.add(tree);
        molecule.explorer.update({
            id: molecule.builtin.getConstants().EXPLORER_ITEM_WORKSPACE,
            name: tree.name,
        });
        molecule.sidebar.updateToolbar(molecule.builtin.getConstants().SIDEBAR_ITEM_EXPLORER, {
            id: molecule.builtin.getConstants().EXPLORER_ITEM_WORKSPACE,
            name: tree.name,
        });
    });
});

// 右键菜单事件
molecule.folderTree.onContextMenu((_, treeNode) => {
    if (treeNode.fileType === FileTypes.File) {
        molecule.contextMenu.add([
            { id: 'testPane', name: '打开 testPane 面板' },
            { id: 'testPane_divider', type: 'divider' },
        ]);
    }
});

// 右键菜单点击事件
molecule.folderTree.onContextMenuClick((item, treeNode) => {
    const { EXPLORER_CONTEXTMENU_OPEN_TO_SIDE } = molecule.builtin.getConstants();
    switch (item.id) {
        case EXPLORER_CONTEXTMENU_OPEN_TO_SIDE: {
            openFile(treeNode);
            break;
        }
        default:
            break;
    }
});

// 拖拽事件
molecule.folderTree.onDrop((source, target) => {
    molecule.folderTree.drop(source.id, target.id);
});

// 更新事件
molecule.folderTree.onUpdate((treeNode) => {
    const next = molecule.folderTree.get(treeNode.id);
    if (!next) return;
    molecule.editor.setLoading(true);
    const { groups } = molecule.editor.getState();
    groups.forEach((group) => {
        const tab = molecule.editor.getTab(treeNode.id, group.id);
        if (tab) {
            molecule.editor.updateTab(
                {
                    id: next.id,
                    name: treeNode.name,
                    icon: treeNode.icon || 'file',
                    value: tab.value,
                    breadcrumb: (treeNode.id as string)
                        .split('/')
                        .filter(Boolean)
                        .map((i) => ({ id: i, name: i })),
                },
                group.id
            );
        }
    });
    molecule.editor.setLoading(false);
});
```

## 🔍 Search (搜索) 使用

### 搜索事件监听
```typescript
// 搜索输入事件
const searchByValue = (value: string) => {
    if (!value) {
        molecule.search.setResult([], 0);
        return;
    }
    molecule.sidebar.setLoading(true);
    searchFileContents(value)
        .then((data) => {
            molecule.search.setResult(
                data.map((item) => ({
                    id: `${item.filename}_${item.startline}`,
                    filename: item.filename,
                    data: item.data,
                    path: item.path,
                    lineNumber: item.startline,
                })),
                data.length
            );
            molecule.search.expandAll();
        })
        .finally(() => {
            molecule.sidebar.setLoading(false);
        });
};

molecule.search.onEnter(searchByValue);
molecule.search.onSearch(debounce(searchByValue, 1000));

// 搜索结果选择事件
molecule.search.onSelect((treeNode) => {
    if (treeNode.fileType === 'File') {
        openFile({ id: treeNode.id, name: treeNode.name });
    }
});
```

## 🍽️ Menu Bar (菜单栏) 使用

### 菜单事件监听
```typescript
molecule.menuBar.onSelect((menuId) => {
    if (menuId === molecule.builtin.getConstants().MENUBAR_ITEM_ABOUT) {
        window.open('https://github.com/DTStack/molecule', '_blank');
    }
});

// 订阅菜单事件
molecule.menuBar.subscribe('APP_DEBUG_ICON', () => {
    const quickPick = monaco.QuickInputService.createQuickPick();
    quickPick.busy = true;
    quickPick.items = [];
    quickPick.show();
});
```

## 🎯 Context Menu (右键菜单) 使用

### 右键菜单事件监听
```typescript
molecule.contextMenu.onClick((item) => {
    if (item.id === 'testPane__activityBar__molecule') {
        alert('Molecule');
    }
});
```

## 📢 Notification (通知) 使用

### 添加通知
```typescript
// 错误通知
molecule.notification.add({
    id: `getFiles${id}`,
    value: err.message,
});

// 成功通知
molecule.notification.open({
    id: `close_tab_${new Date().valueOf()}`,
    value: `关闭了 ${tabs.length} 个 tab`,
});
```

### 设置通知可见性
```typescript
molecule.layout.setNotification(true);
```

## 🏗️ Builtin (内置) 使用

### 获取常量
```typescript
const { EXPLORER_CONTEXTMENU_OPEN_TO_SIDE } = molecule.builtin.getConstants();
const { EXPLORER_ITEM_WORKSPACE } = molecule.builtin.getConstants();
const { SIDEBAR_ITEM_EXPLORER } = molecule.builtin.getConstants();
const { MENUBAR_ITEM_ABOUT } = molecule.builtin.getConstants();
```

## 🔄 插件系统集成

### 插件系统初始化
```typescript
let pluginSystem: PluginSystemService | null = null;

// 延迟初始化插件系统
setTimeout(() => {
    try {
        console.log('Starting plugin system initialization...');
        pluginSystem = new PluginSystemService(molecule);
        pluginSystem.initialize().then(() => {
            console.log('Plugin system initialized successfully');
            
            // 监听插件事件
            if (pluginSystem) {
                const pluginManager = pluginSystem.getPluginManager();
                
                // 监听 RSS 插件的编辑器打开事件
                pluginManager.on('rss:openArticle', (data: any) => {
                    console.log('Opening RSS article in editor:', data);
                    
                    // 检查标签页是否已存在
                    const editorState = molecule.editor.getState();
                    const existingTab = editorState.groups?.flatMap((group: any) => group.data || [])
                        .find((tab: any) => tab.id === data.id);
                    
                    if (existingTab) {
                        console.log('RSS article tab already exists, switching to it:', data.name);
                        const group = editorState.groups?.find((group: any) => 
                            group.data?.some((tab: any) => tab.id === data.id)
                        );
                        
                        if (group) {
                            molecule.editor.setCurrent(data.id, group.id);
                            return;
                        }
                    }
                    
                    // 打开新标签页
                    molecule.editor.open({
                        id: data.id,
                        name: data.name,
                        value: data.content,
                        language: data.language || 'markdown',
                        icon: 'file'
                    });
                });

                // 监听 AI 助手更新文章事件
                pluginManager.on('ai:updateArticle', (article: any) => {
                    console.log('Updating AI assistant with article:', article.title);
                    updateCurrentArticle(article);
                });
            }
        }).catch(error => {
            console.error('Failed to initialize plugin system:', error);
        });
    } catch (error) {
        console.error('Failed to create plugin system:', error);
    }
}, 2000);
```

## 🎨 最佳实践总结

### 1. 错误处理模式
```typescript
try {
    // API 调用
    molecule.activityBar.add({...});
    console.log('✅ API call successful');
} catch (error) {
    console.error('❌ API call failed:', error);
    // 回退处理
}
```

### 2. 延迟初始化模式
```typescript
setTimeout(() => {
    // 初始化逻辑
}, 2000); // 2-3秒延迟
```

### 3. 状态检查模式
```typescript
if (molecule && molecule.activityBar) {
    // 使用 API
} else {
    console.warn('API not available');
}
```

### 4. 事件监听模式
```typescript
molecule.editor.onSelectTab((tabId, groupId) => {
    // 处理事件
    updateCurrentTabContent(tabId, groupId);
});
```

### 5. 加载状态管理
```typescript
molecule.editor.setLoading(true);
// 执行操作
.finally(() => {
    molecule.editor.setLoading(false);
});
```

## 📚 关键要点

1. **延迟初始化**: 使用 `setTimeout` 确保 Molecule 完全加载
2. **错误处理**: 所有 API 调用都应该有 try-catch 包装
3. **状态管理**: 使用加载状态提供用户反馈
4. **事件驱动**: 大量使用事件监听器处理用户交互
5. **常量使用**: 使用 `molecule.builtin.getConstants()` 获取内置常量
6. **组件渲染**: 使用 React 组件作为 render 函数

---

**这个总结涵盖了 TestExtension 中所有重要的 API 使用模式，可以作为开发插件时的参考。**
