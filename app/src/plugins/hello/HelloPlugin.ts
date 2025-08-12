import { IPluginAPI, IPluginClass } from '../../core/pluginSystem/types';
import React from 'react';

export class HelloPlugin implements IPluginClass {
  private api: IPluginAPI | null = null;

  async onload(api: IPluginAPI) {
    this.api = api;
    console.log('Hello Plugin loaded successfully!');
    
    // 延迟添加 UI 元素，确保 Molecule 完全加载
    setTimeout(() => {
      this.addHelloActivityBarItem();
    }, 2000);
  }

  async onunload() {
    console.log('Hello Plugin unloaded');
    // 清理资源
  }

  private addHelloActivityBarItem() {
    console.log('Hello Plugin: Starting to add activity bar item');
    console.log('Hello Plugin: API available:', !!this.api);
    console.log('Hello Plugin: UI API available:', !!this.api?.ui);
    console.log('Hello Plugin: addActivityBarItem available:', !!this.api?.ui?.addActivityBarItem);
    
    // 优先使用 Molecule API
    if (this.api && this.api.ui && this.api.ui.addActivityBarItem) {
      try {
        console.log('Hello Plugin: Using Molecule API to add activity bar item');
        this.api.ui.addActivityBarItem({
          id: 'hello-plugin',
          name: 'Hello Plugin',
          icon: 'lightbulb', // 使用 Molecule 支持的图标名称
          sortIndex: 4,
          alignment: 'top',
          onClick: () => {
            console.log('Hello Plugin: Activity bar item clicked');
            this.showHelloSidebar();
          }
        });
        console.log('Hello Plugin: Activity bar item added via Molecule API');
        
        // 监听 Molecule 的 ActivityBar 点击事件
        if (this.api.molecule && this.api.molecule.activityBar) {
          this.api.molecule.activityBar.onClick((item: any) => {
            console.log('Hello Plugin: ActivityBar click event received:', item);
            if (item && item.id === 'hello-plugin') {
              console.log('Hello Plugin: Hello item clicked, showing sidebar');
              this.showHelloSidebar();
            }
          });
        }
      } catch (error) {
        console.error('Hello Plugin: Failed to add activity bar item via API:', error);
        // 回退到 DOM 操作
        this.addHelloActivityBarItemViaDOM();
      }
    } else {
      console.log('Hello Plugin: Molecule UI API not available, using DOM fallback');
      this.addHelloActivityBarItemViaDOM();
    }
  }

  private addHelloActivityBarItemViaDOM() {
    // 查找活动栏
    const activityBar = document.querySelector('[data-testid="activityBar"]') || 
                       document.querySelector('.activityBar') ||
                       document.querySelector('[class*="activity"]') ||
                       document.querySelector('[class*="ActivityBar"]') ||
                       document.querySelector('[class*="activityBar"]') ||
                       document.querySelector('.mo-activityBar__container');
    
    if (activityBar) {
      console.log('Hello Plugin: Found activity bar:', activityBar);
      
      const icon = document.createElement('div');
      icon.innerHTML = '💡'; // 使用 emoji 作为图标
      icon.title = 'Hello Plugin';
      icon.style.cssText = `
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        transition: background-color 0.2s;
        border-radius: 4px;
        margin: 4px 0;
        color: var(--activityBar-inactiveForeground, #cccccc);
      `;
      
      icon.onmouseover = () => {
        icon.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      };
      
      icon.onmouseout = () => {
        icon.style.backgroundColor = 'transparent';
      };
      
      icon.onclick = () => {
        console.log('Hello Plugin: Icon clicked via DOM');
        this.showHelloSidebar();
      };
      
      // 插入到合适位置
      const firstItem = activityBar.querySelector('[class*="item"], [class*="icon"]');
      if (firstItem) {
        activityBar.insertBefore(icon, firstItem);
      } else {
        activityBar.appendChild(icon);
      }
      
      console.log('Hello Plugin: Activity bar item added via DOM');
    } else {
      console.log('Hello Plugin: Activity bar not found, retrying...');
      setTimeout(() => this.addHelloActivityBarItemViaDOM(), 1000);
    }
  }

  private showHelloSidebar() {
    console.log('Hello Plugin: showHelloSidebar called');
    
    // 使用 Molecule API 在侧边栏显示内容
    if (this.api && this.api.molecule && this.api.molecule.sidebar) {
      try {
        console.log('Hello Plugin: Using Molecule sidebar API directly');
        this.api.molecule.sidebar.add({
          id: 'hello-sidebar',
          name: 'Hello World',
          render: () => {
            console.log('Hello Plugin: Rendering Hello sidebar content');
            
            // 创建包含 Hello World 内容的 React 元素
            const content = React.createElement('div', {
              style: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#252526',
                color: '#cccccc',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }
            }, [
              // 标题栏
              React.createElement('div', {
                key: 'header',
                style: {
                  padding: '16px 20px',
                  borderBottom: '1px solid #3c3c3c',
                  textAlign: 'center'
                }
              }, [
                React.createElement('h2', {
                  key: 'title',
                  style: {
                    color: '#007acc',
                    margin: '0 0 8px 0',
                    fontSize: '24px'
                  }
                }, '👋 Hello World'),
                React.createElement('div', {
                  key: 'subtitle',
                  style: {
                    fontSize: '14px',
                    color: '#cccccc80'
                  }
                }, '这是一个简单的 Hello 插件示例！')
              ]),
              
              // 功能说明
              React.createElement('div', {
                key: 'features',
                style: {
                  flex: 1,
                  padding: '20px',
                  overflowY: 'auto'
                }
              }, [
                React.createElement('div', {
                  key: 'features-header',
                  style: {
                    marginBottom: '16px',
                    padding: '12px 16px',
                    backgroundColor: '#1e1e1e',
                    borderRadius: '6px',
                    borderLeft: '4px solid #007acc'
                  }
                }, [
                  React.createElement('h3', {
                    key: 'features-title',
                    style: {
                      margin: '0 0 12px 0',
                      color: '#007acc',
                      fontSize: '16px'
                    }
                  }, '插件功能：'),
                  React.createElement('ul', {
                    key: 'features-list',
                    style: {
                      margin: 0,
                      paddingLeft: '20px',
                      lineHeight: '1.6'
                    }
                  }, [
                    React.createElement('li', { key: 'feature1' }, '✅ 点击图标显示 Hello World'),
                    React.createElement('li', { key: 'feature2' }, '✅ 在侧边栏显示内容'),
                    React.createElement('li', { key: 'feature3' }, '✅ 在编辑器中创建文件'),
                    React.createElement('li', { key: 'feature4' }, '✅ 状态栏集成'),
                    React.createElement('li', { key: 'feature5' }, '✅ 命令系统支持')
                  ])
                ]),
                
                // 技术信息
                React.createElement('div', {
                  key: 'tech-info',
                  style: {
                    marginTop: '20px',
                    padding: '12px 16px',
                    backgroundColor: '#1e1e1e',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#cccccc80'
                  }
                }, [
                  React.createElement('div', { key: 'tech1' }, '🔧 技术实现：'),
                  React.createElement('div', { key: 'tech2' }, '• 继承 IPluginClass 接口'),
                  React.createElement('div', { key: 'tech3' }, '• 使用 Molecule API'),
                  React.createElement('div', { key: 'tech4' }, '• React 组件渲染'),
                  React.createElement('div', { key: 'tech5' }, '• 错误处理和回退')
                ])
              ]),
              
              // 时间戳
              React.createElement('div', {
                key: 'timestamp',
                style: {
                  padding: '12px 20px',
                  borderTop: '1px solid #3c3c3c',
                  fontSize: '12px',
                  color: '#888',
                  textAlign: 'center'
                }
              }, `加载时间: ${new Date().toLocaleString('zh-CN')}`)
            ]);
            
            console.log('Hello Plugin: Hello sidebar content created successfully');
            return content;
          }
        });

        // 设置为当前活动的侧边栏
        this.api.molecule.sidebar.setCurrent('hello-sidebar');
        
        console.log('Hello Plugin: Sidebar displayed successfully');
        
        // 显示通知
        this.showNotice('Hello World! 👋');
        
        // 在编辑器中显示 Hello World
        this.showHelloInEditor();
      } catch (error) {
        console.error('Hello Plugin: Failed to show sidebar:', error);
        this.showNotice('侧边栏显示失败，请检查控制台错误');
      }
    } else {
      console.log('Hello Plugin: Molecule sidebar API not available');
      this.showNotice('侧边栏API不可用');
    }
  }

  private showHelloInEditor() {
    // 创建 Hello World 内容
    const content = `# 👋 Hello World!

欢迎使用 Hello 插件！

## 功能特性

- ✅ **状态栏集成**: 在状态栏显示插件状态
- ✅ **图标点击**: 点击功能区图标触发功能
- ✅ **侧边栏显示**: 在侧边栏显示插件内容
- ✅ **编辑器集成**: 在编辑器中创建和显示内容
- ✅ **命令支持**: 支持通过命令面板调用

## 插件信息

- **插件名称**: Hello Plugin
- **版本**: 1.0.0
- **作者**: Molecule Team
- **加载时间**: ${new Date().toLocaleString('zh-CN')}

## 使用方法

1. 点击左侧活动栏的 💡 图标
2. 或使用命令面板执行 "Show Hello World"
3. 查看侧边栏和编辑器中的内容

## 技术实现

这个插件展示了如何：

- 继承 \`IPluginClass\` 接口
- 实现 \`onload\` 和 \`onunload\` 方法
- 使用 Molecule API 添加 UI 元素
- 集成 Molecule 框架功能

---

*这是一个用于验证插件开发流程的示例插件*
`;

    const tabId = 'hello-world';
    const tabName = 'Hello World.md';

    // 使用 Molecule 编辑器 API 打开文件
    if (this.api && this.api.molecule && this.api.molecule.editor) {
      try {
        // 检查标签页是否已存在
        const editorState = this.api.molecule.editor.getState();
        const existingTab = editorState.groups?.flatMap((group: any) => group.data || [])
          .find((tab: any) => tab.id === tabId);
        
        if (existingTab) {
          console.log('Hello Plugin: Hello World tab already exists, switching to it');
          
          // 找到包含该标签页的组
          const group = editorState.groups?.find((group: any) => 
            group.data?.some((tab: any) => tab.id === tabId)
          );
          
          if (group) {
            // 切换到已存在的标签页
            this.api.molecule.editor.setCurrent(tabId, group.id);
            return;
          }
        }
        
        console.log('Hello Plugin: Opening Hello World in editor');
        
        // 创建新的标签页
        this.api.molecule.editor.open({
          id: tabId,
          name: tabName,
          value: content,
          language: 'markdown',
          icon: 'file'
        });

        console.log('Hello Plugin: Hello World opened successfully in editor');
      } catch (error) {
        console.error('Hello Plugin: Failed to open Hello World in editor:', error);
        this.showNotice('编辑器打开失败，请检查控制台错误');
      }
    } else {
      console.log('Hello Plugin: Molecule editor API not available');
      this.showNotice('编辑器API不可用');
    }
  }

  private showNotice(message: string) {
    // 创建通知元素
    const notice = document.createElement('div');
    notice.textContent = message;
    notice.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--notification-background, #007acc);
      color: var(--notification-foreground, white);
      padding: 12px 16px;
      border-radius: 4px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
    `;

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notice);

    // 3秒后自动移除
    setTimeout(() => {
      if (notice.parentNode) {
        notice.parentNode.removeChild(notice);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 3000);
  }
}
