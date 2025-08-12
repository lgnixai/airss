# Molecule 插件开发标准规范

## 📖 概述

本文档基于 RSS 插件的成功实现，制定了 Molecule 插件开发的统一标准。所有插件都应该遵循这个标准来确保一致性和可维护性。

## 🏗️ 插件架构标准

### 1. 插件类定义

```typescript
import { IPluginAPI, IPluginClass } from '../../core/pluginSystem/types';
import React from 'react';

export class YourPlugin implements IPluginClass {
  private api: IPluginAPI | null = null;

  async onload(api: IPluginAPI) {
    this.api = api;
    console.log('Your Plugin loaded successfully!');
    
    // 初始化数据
    this.initializeData();
    
    // 延迟添加 UI 元素，确保 Molecule 完全加载
    setTimeout(() => {
      this.addActivityBarItem();
    }, 2000);
  }

  async onunload() {
    console.log('Your Plugin unloaded');
    // 清理资源
  }
}
```

### 2. 活动栏图标添加标准

```typescript
private addActivityBarItem() {
  console.log('Your Plugin: Starting to add activity bar item');
  console.log('Your Plugin: API available:', !!this.api);
  console.log('Your Plugin: UI API available:', !!this.api?.ui);
  console.log('Your Plugin: addActivityBarItem available:', !!this.api?.ui?.addActivityBarItem);
  
  // 优先使用 Molecule API
  if (this.api && this.api.ui && this.api.ui.addActivityBarItem) {
    try {
      console.log('Your Plugin: Using Molecule API to add activity bar item');
      this.api.ui.addActivityBarItem({
        id: 'your-plugin-id',
        name: 'Your Plugin Name',
        icon: 'icon-name', // 使用 Molecule 支持的图标名称
        sortIndex: 1,
        alignment: 'top',
        onClick: () => {
          console.log('Your Plugin: Activity bar item clicked');
          this.showYourSidebar();
        }
      });
      console.log('Your Plugin: Activity bar item added via Molecule API');
      
      // 监听 Molecule 的 ActivityBar 点击事件
      if (this.api.molecule && this.api.molecule.activityBar) {
        this.api.molecule.activityBar.onClick((item: any) => {
          console.log('Your Plugin: ActivityBar click event received:', item);
          if (item && item.id === 'your-plugin-id') {
            console.log('Your Plugin: Item clicked, showing sidebar');
            this.showYourSidebar();
          }
        });
      }
    } catch (error) {
      console.error('Your Plugin: Failed to add activity bar item via API:', error);
      // 回退到 DOM 操作
      this.addActivityBarItemViaDOM();
    }
  } else {
    console.log('Your Plugin: Molecule UI API not available, using DOM fallback');
    this.addActivityBarItemViaDOM();
  }
}
```

### 3. DOM 回退实现标准

```typescript
private addActivityBarItemViaDOM() {
  // 查找活动栏
  const activityBar = document.querySelector('[data-testid="activityBar"]') || 
                     document.querySelector('.activityBar') ||
                     document.querySelector('[class*="activity"]') ||
                     document.querySelector('[class*="ActivityBar"]') ||
                     document.querySelector('[class*="activityBar"]') ||
                     document.querySelector('.mo-activityBar__container');
  
  if (activityBar) {
    console.log('Your Plugin: Found activity bar:', activityBar);
    
    const icon = document.createElement('div');
    icon.innerHTML = '🔧'; // 使用 emoji 作为图标
    icon.title = 'Your Plugin Name';
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
      console.log('Your Plugin: Icon clicked via DOM');
      this.showYourSidebar();
    };
    
    // 插入到合适位置
    const firstItem = activityBar.querySelector('[class*="item"], [class*="icon"]');
    if (firstItem) {
      activityBar.insertBefore(icon, firstItem);
    } else {
      activityBar.appendChild(icon);
    }
    
    console.log('Your Plugin: Activity bar item added via DOM');
  } else {
    console.log('Your Plugin: Activity bar not found, retrying...');
    setTimeout(() => this.addActivityBarItemViaDOM(), 1000);
  }
}
```

### 4. 侧边栏显示标准

```typescript
private showYourSidebar() {
  // 使用 Molecule API 在侧边栏显示内容
  if (this.api && this.api.molecule && this.api.molecule.sidebar) {
    try {
      this.api.molecule.sidebar.add({
        id: 'your-sidebar',
        name: 'Your Plugin',
        render: () => {
          const container = document.createElement('div');
          container.style.cssText = `
            height: 100%;
            display: flex;
            flex-direction: column;
            background-color: var(--sideBar-background, #252526);
            color: var(--sideBar-foreground, #cccccc);
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          `;

          // 标题
          const title = container.createEl('h2', { 
            text: 'Your Plugin Title',
            cls: 'your-title'
          });
          title.style.cssText = `
            color: var(--sideBarTitle-activeForeground, #007acc);
            margin-bottom: 20px;
            text-align: center;
            font-size: 24px;
          `;

          // 内容
          const content = container.createEl('div', { 
            text: 'Your plugin content here',
            cls: 'your-content'
          });
          content.style.cssText = `
            line-height: 1.6;
            margin-bottom: 20px;
          `;

          return container;
        }
      });

      // 设置为当前活动的侧边栏
      this.api.molecule.sidebar.setCurrent('your-sidebar');
      
      console.log('Your Plugin: Sidebar displayed successfully');
    } catch (error) {
      console.error('Your Plugin: Failed to show sidebar:', error);
      this.showNotice('侧边栏显示失败，请检查控制台错误');
    }
  } else {
    console.log('Your Plugin: Molecule sidebar API not available');
    this.showNotice('侧边栏API不可用');
  }
}
```

### 5. 通知显示标准

```typescript
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
```

## 🎯 关键原则

### 1. API 优先原则
- 优先使用 Molecule API (`this.api.ui.addActivityBarItem`)
- 提供 DOM 回退实现
- 确保向后兼容性

### 2. 延迟初始化原则
- 使用 `setTimeout` 确保 Molecule 完全加载
- 延迟时间：2000ms
- 提供重试机制

### 3. 错误处理原则
- 所有 API 调用都要有 try-catch
- 提供回退方案
- 记录详细的错误日志

### 4. 日志记录原则
- 记录插件加载状态
- 记录 API 可用性
- 记录用户操作

### 5. 样式兼容原则
- 使用 CSS 变量
- 支持主题切换
- 保持与 Molecule 风格一致

## 📋 插件清单

### 必需实现的方法
- [ ] `onload(api: IPluginAPI)` - 插件加载
- [ ] `onunload()` - 插件卸载
- [ ] `addActivityBarItem()` - 添加活动栏图标
- [ ] `addActivityBarItemViaDOM()` - DOM 回退实现
- [ ] `showYourSidebar()` - 显示侧边栏
- [ ] `showNotice(message: string)` - 显示通知

### 推荐实现的功能
- [ ] 数据初始化
- [ ] 事件监听
- [ ] 资源清理
- [ ] 错误处理
- [ ] 用户反馈

## 🔧 调试指南

### 1. 检查插件加载
```javascript
// 在浏览器控制台执行
console.log('Plugin loaded:', window.yourPlugin);
```

### 2. 检查 API 可用性
```javascript
// 检查 API 是否可用
console.log('API available:', !!window.yourPlugin?.api);
console.log('UI API available:', !!window.yourPlugin?.api?.ui);
```

### 3. 手动触发功能
```javascript
// 手动显示侧边栏
window.yourPlugin?.showYourSidebar();
```

## 📚 参考实现

- **RSS 插件**：`src/plugins/rss/RssPlugin.ts` - 完整的功能实现
- **Hello 插件**：`src/plugins/hello/HelloPlugin.ts` - 需要按标准重构

---

**注意**：所有新插件都应该遵循这个标准，确保一致性和可维护性。
