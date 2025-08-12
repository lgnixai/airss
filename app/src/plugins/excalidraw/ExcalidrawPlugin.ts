import { IPluginAPI, IPluginClass } from '../../core/pluginSystem/types';
import React from 'react';

export class ExcalidrawPlugin implements IPluginClass {
  private api: IPluginAPI | null = null;
  private canvasStates: Map<string, any> = new Map(); // 存储每个画布的状态

  async onload(api: IPluginAPI) {
    this.api = api;
    console.log('Excalidraw Plugin loaded successfully!');
    
    setTimeout(() => {
      this.addExcalidrawActivityBarItem();
    }, 2000);
  }

  async onunload() {
    console.log('Excalidraw Plugin unloaded');
  }

  private addExcalidrawActivityBarItem() {
    console.log('Excalidraw Plugin: Starting to add activity bar item');
    console.log('Excalidraw Plugin: API available:', !!this.api);
    console.log('Excalidraw Plugin: UI API available:', !!this.api?.ui);
    console.log('Excalidraw Plugin: addActivityBarItem available:', !!this.api?.ui?.addActivityBarItem);
    
    // 优先使用 Molecule API
    if (this.api && this.api.ui && this.api.ui.addActivityBarItem) {
      try {
        console.log('Excalidraw Plugin: Using Molecule API to add activity bar item');
        this.api.ui.addActivityBarItem({
          id: 'excalidraw-plugin',
          name: 'Excalidraw 白板',
          icon: 'pencil',
          sortIndex: 5,
          alignment: 'top',
          onClick: () => {
            console.log('Excalidraw Plugin: Activity bar item clicked');
            this.showExcalidrawSidebar();
          }
        });
        console.log('Excalidraw Plugin: Activity bar item added via Molecule API');
        
        // 监听 Molecule 的 ActivityBar 点击事件
        if (this.api.molecule && this.api.molecule.activityBar) {
          this.api.molecule.activityBar.onClick((item: any) => {
            console.log('Excalidraw Plugin: ActivityBar click event received:', item);
            if (item && item.id === 'excalidraw-plugin') {
              console.log('Excalidraw Plugin: Excalidraw item clicked, showing sidebar');
              this.showExcalidrawSidebar();
            }
          });
        }
      } catch (error) {
        console.error('Excalidraw Plugin: Failed to add activity bar item via API:', error);
        this.addExcalidrawActivityBarItemViaDOM();
      }
    } else {
      console.log('Excalidraw Plugin: Molecule UI API not available, using DOM fallback');
      this.addExcalidrawActivityBarItemViaDOM();
    }
  }

  private addExcalidrawActivityBarItemViaDOM() {
    const activityBar = document.querySelector('.mo-activityBar__container');
    if (activityBar) {
      const icon = document.createElement('div');
      icon.innerHTML = '✏️';
      icon.title = 'Excalidraw 白板';
      icon.style.cssText = `
        width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
        cursor: pointer; font-size: 20px; transition: background-color 0.2s; border-radius: 4px;
        margin: 4px 0; color: var(--activityBar-inactiveForeground, #cccccc);
      `;
      icon.onclick = () => this.showExcalidrawSidebar();
      activityBar.appendChild(icon);
    }
  }

  private showExcalidrawSidebar() {
    console.log('Excalidraw Plugin: showExcalidrawSidebar called');
    
    if (this.api && this.api.molecule && this.api.molecule.sidebar) {
      try {
        console.log('Excalidraw Plugin: Using Molecule sidebar API directly');
        this.api.molecule.sidebar.add({
          id: 'excalidraw-sidebar',
          name: 'Excalidraw 白板',
          render: () => {
            return React.createElement('div', {
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
                  padding: '20px',
                  borderBottom: '1px solid #3c3c3c',
                  textAlign: 'center'
                }
              }, [
                React.createElement('h1', {
                  key: 'title',
                  style: {
                    color: '#007acc',
                    margin: '0 0 8px 0',
                    fontSize: '28px',
                    fontWeight: 'bold'
                  }
                }, '✏️ Excalidraw'),
                React.createElement('div', {
                  key: 'subtitle',
                  style: {
                    fontSize: '14px',
                    color: '#cccccc80',
                    marginBottom: '16px'
                  }
                }, '无限画布，无限创意'),
                // 创建新画布按钮
                React.createElement('button', {
                  key: 'create-button',
                  style: {
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#007acc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  },
                  onClick: () => this.createNewCanvas()
                }, '🆕 创建新画布')
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
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    color: '#007acc'
                  }
                }, '✨ 功能特性'),
                React.createElement('div', {
                  key: 'features-list',
                  style: {
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: '#cccccc80'
                  }
                }, [
                  React.createElement('div', { key: 'feature1' }, '• 无限画布，自由创作'),
                  React.createElement('div', { key: 'feature2' }, '• 多种绘图工具'),
                  React.createElement('div', { key: 'feature3' }, '• 实时绘制预览'),
                  React.createElement('div', { key: 'feature4' }, '• 简洁直观的界面'),
                  React.createElement('div', { key: 'feature5' }, '• 支持图形、文字、箭头'),
                  React.createElement('div', { key: 'feature6' }, '• 笔记和图片元素')
                ])
              ])
            ]);
          }
        });

        this.api.molecule.sidebar.setCurrent('excalidraw-sidebar');
        this.showNotice('Excalidraw 白板已启动！✏️');
        
      } catch (error) {
        this.showNotice('侧边栏显示失败');
      }
    }
  }

  private createNewCanvas() {
    const canvasId = `excalidraw-${Date.now()}`;
    const canvasName = `画布_${new Date().toLocaleString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
    
    if (this.api && this.api.molecule && this.api.molecule.editor) {
      try {
        // 使用自定义编辑器打开画布，使用 render 属性创建自定义组件
        this.api.molecule.editor.open({
          id: canvasId,
          name: canvasName,
          value: 'Excalidraw Canvas', // 简单的值，实际内容由 render 函数提供
          language: 'typescript',
          icon: 'file',
          breadcrumb: [
            { id: 'app', name: 'app' },
            { id: 'plugins', name: 'plugins' },
            { id: 'excalidraw', name: 'excalidraw' },
            { id: 'canvas', name: canvasName, icon: 'file' },
          ],
          // 使用 render 属性创建自定义的 Excalidraw 组件
          render: ({ value }: { value: any }) => this.createExcalidrawComponent(canvasId)
        });
        
        console.log('Excalidraw Plugin: Canvas opened with custom render component');
        this.showNotice('新画布已创建！🎨 现在可以在画布上绘图了');
        
      } catch (error) {
        console.error('Excalidraw Plugin: Failed to open canvas:', error);
        this.showNotice('画布创建失败');
      }
    }
  }

  private createExcalidrawComponent(canvasId: string) {
    console.log('Excalidraw Plugin: Creating Excalidraw component for canvas:', canvasId);
    
    // 初始化画布状态
    if (!this.canvasStates.has(canvasId)) {
      this.canvasStates.set(canvasId, {
        currentTool: 'pen',
        isDrawing: false,
        startX: 0,
        startY: 0,
        elements: [],
        currentElement: null
      });
    }
    
    const state = this.canvasStates.get(canvasId);
    
    // 创建一个包含完整 Excalidraw 功能的 React 组件
    return React.createElement('div', {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }
    }, [
      // 工具栏
      React.createElement('div', {
        key: 'toolbar',
        style: {
          height: '60px',
          backgroundColor: '#2a2d2e',
          borderBottom: '1px solid #3c3c3c',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: '8px'
        }
      }, [
        React.createElement('button', {
          key: 'pen',
          style: this.getToolButtonStyle(state.currentTool === 'pen'),
          onClick: () => this.selectTool(canvasId, 'pen')
        }, '✏️ 画笔'),
        React.createElement('button', {
          key: 'line',
          style: this.getToolButtonStyle(state.currentTool === 'line'),
          onClick: () => this.selectTool(canvasId, 'line')
        }, '📏 直线'),
        React.createElement('button', {
          key: 'rectangle',
          style: this.getToolButtonStyle(state.currentTool === 'rectangle'),
          onClick: () => this.selectTool(canvasId, 'rectangle')
        }, '⬜ 矩形'),
        React.createElement('button', {
          key: 'circle',
          style: this.getToolButtonStyle(state.currentTool === 'circle'),
          onClick: () => this.selectTool(canvasId, 'circle')
        }, '⭕ 圆形'),
        React.createElement('button', {
          key: 'text',
          style: this.getToolButtonStyle(state.currentTool === 'text'),
          onClick: () => this.selectTool(canvasId, 'text')
        }, '💬 文本'),
        React.createElement('button', {
          key: 'arrow',
          style: this.getToolButtonStyle(state.currentTool === 'arrow'),
          onClick: () => this.selectTool(canvasId, 'arrow')
        }, '➡️ 箭头'),
        React.createElement('div', { key: 'spacer', style: { flex: 1 } }),
        React.createElement('button', {
          key: 'clear',
          style: {
            backgroundColor: '#d73a49',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          },
          onClick: () => this.clearCanvas(canvasId)
        }, '🧹 清除画布')
      ]),
      
      // 画布区域
      React.createElement('div', {
        key: 'canvas-container',
        style: {
          flex: 1,
          position: 'relative',
          backgroundColor: '#ffffff',
          overflow: 'hidden'
        }
      }, [
        React.createElement('div', {
          key: 'canvas',
          id: `excalidraw-canvas-${canvasId}`,
          style: {
            width: '100%',
            height: '100%',
            cursor: state.currentTool === 'text' ? 'text' : 'crosshair',
            position: 'relative',
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          },
          onMouseDown: (e: any) => this.handleCanvasMouseDown(e, canvasId),
          onMouseMove: (e: any) => this.handleCanvasMouseMove(e, canvasId),
          onMouseUp: (e: any) => this.handleCanvasMouseUp(e, canvasId)
        }),
        
        // 状态栏
        React.createElement('div', {
          key: 'status-bar',
          style: {
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '30px',
            backgroundColor: '#2a2d2e',
            color: '#cccccc',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            fontSize: '12px',
            borderTop: '1px solid #3c3c3c'
          }
        }, [
          React.createElement('div', {
            key: 'coordinates',
            id: `coordinates-${canvasId}`
          }, '坐标: 0, 0'),
          React.createElement('div', {
            key: 'tool-info',
            id: `tool-info-${canvasId}`,
            style: { flex: 1, marginLeft: '16px' }
          }, `当前工具: ${this.getToolName(state.currentTool)}`)
        ])
      ])
    ]);
  }

  private getToolButtonStyle(isActive: boolean) {
    return {
      width: '40px',
      height: '40px',
      border: `1px solid ${isActive ? '#007acc' : '#3c3c3c'}`,
      borderRadius: '6px',
      background: isActive ? '#007acc' : '#2a2d2e',
      color: isActive ? 'white' : '#cccccc',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s'
    };
  }

  private selectTool(canvasId: string, tool: string) {
    console.log('Excalidraw Plugin: Tool selected:', tool, 'for canvas:', canvasId);
    const state = this.canvasStates.get(canvasId);
    if (state) {
      state.currentTool = tool;
      this.canvasStates.set(canvasId, state);
      
      // 更新工具信息显示
      const toolInfo = document.getElementById(`tool-info-${canvasId}`);
      if (toolInfo) {
        toolInfo.textContent = `当前工具: ${this.getToolName(tool)}`;
      }
      
      // 更新光标
      const canvas = document.getElementById(`excalidraw-canvas-${canvasId}`);
      if (canvas) {
        canvas.style.cursor = tool === 'text' ? 'text' : 'crosshair';
      }
      
      // 强制重新渲染组件
      this.forceRerender(canvasId);
    }
  }

  private getToolName(tool: string): string {
    const toolNames: { [key: string]: string } = {
      pen: '画笔',
      line: '直线',
      rectangle: '矩形',
      circle: '圆形',
      text: '文本',
      arrow: '箭头'
    };
    return toolNames[tool] || tool;
  }

  private forceRerender(canvasId: string) {
    // 这里可以添加强制重新渲染的逻辑
    // 由于我们使用的是 React.createElement，可能需要通过其他方式触发重新渲染
    console.log('Excalidraw Plugin: Force rerender for canvas:', canvasId);
  }

  private clearCanvas(canvasId: string) {
    console.log('Excalidraw Plugin: Clearing canvas:', canvasId);
    const canvas = document.getElementById(`excalidraw-canvas-${canvasId}`);
    if (canvas) {
      // 清除所有绘图元素
      const elements = canvas.querySelectorAll('.drawing-element');
      elements.forEach(element => element.remove());
      
      // 清除预览
      this.clearPreview(canvasId);
      
      // 重置状态
      const state = this.canvasStates.get(canvasId);
      if (state) {
        state.elements = [];
        state.isDrawing = false;
        this.canvasStates.set(canvasId, state);
      }
    }
  }

  private handleCanvasMouseDown(e: React.MouseEvent, canvasId: string) {
    console.log('Excalidraw Plugin: Mouse down on canvas:', canvasId);
    const state = this.canvasStates.get(canvasId);
    if (!state) return;

    const canvas = document.getElementById(`excalidraw-canvas-${canvasId}`);
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    state.isDrawing = true;
    state.startX = x;
    state.startY = y;

    if (state.currentTool === 'text') {
      this.createTextElement(canvasId, x, y);
    }

    this.canvasStates.set(canvasId, state);
  }

  private handleCanvasMouseMove(e: React.MouseEvent, canvasId: string) {
    const canvas = document.getElementById(`excalidraw-canvas-${canvasId}`);
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // 更新坐标显示
    const coordinates = document.getElementById(`coordinates-${canvasId}`);
    if (coordinates) {
      coordinates.textContent = `坐标: ${x}, ${y}`;
    }

    const state = this.canvasStates.get(canvasId);
    if (!state || !state.isDrawing) return;

    // 实时绘制预览
    this.updateDrawingPreview(canvasId, x, y);
  }

  private handleCanvasMouseUp(e: React.MouseEvent, canvasId: string) {
    console.log('Excalidraw Plugin: Mouse up on canvas:', canvasId);
    const state = this.canvasStates.get(canvasId);
    if (!state || !state.isDrawing) return;

    const canvas = document.getElementById(`excalidraw-canvas-${canvasId}`);
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const endX = Math.round(e.clientX - rect.left);
    const endY = Math.round(e.clientY - rect.top);

    // 创建绘图元素
    this.createElement(canvasId, state.startX, state.startY, endX, endY);

    state.isDrawing = false;
    this.canvasStates.set(canvasId, state);

    // 清除预览
    this.clearPreview(canvasId);
  }

  private createElement(canvasId: string, startX: number, startY: number, endX: number, endY: number) {
    const state = this.canvasStates.get(canvasId);
    if (!state) return;

    const canvas = document.getElementById(`excalidraw-canvas-${canvasId}`);
    if (!canvas) return;

    const element = document.createElement('div');
    element.className = 'drawing-element';
    element.style.position = 'absolute';
    element.style.pointerEvents = 'none';

    switch (state.currentTool) {
      case 'pen':
        this.createPenStroke(canvas, startX, startY, endX, endY);
        break;
      case 'line':
        this.createLine(canvas, element, startX, startY, endX, endY);
        break;
      case 'rectangle':
        this.createRectangle(canvas, element, startX, startY, endX, endY);
        break;
      case 'circle':
        this.createCircle(canvas, element, startX, startY, endX, endY);
        break;
      case 'arrow':
        this.createArrow(canvas, element, startX, startY, endX, endY);
        break;
    }

    if (element.style.width || element.style.height) {
      canvas.appendChild(element);
      state.elements.push(element);
      this.canvasStates.set(canvasId, state);
    }
  }

  private createPenStroke(canvas: HTMLElement, startX: number, startY: number, endX: number, endY: number) {
    const line = document.createElement('div');
    line.className = 'drawing-element';
    line.style.position = 'absolute';
    line.style.pointerEvents = 'none';
    line.style.background = '#007acc';
    line.style.height = '2px';
    line.style.transformOrigin = 'left center';

    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX);

    line.style.left = startX + 'px';
    line.style.top = startY + 'px';
    line.style.width = length + 'px';
    line.style.transform = `rotate(${angle}rad)`;

    canvas.appendChild(line);
  }

  private createLine(canvas: HTMLElement, element: HTMLElement, startX: number, startY: number, endX: number, endY: number) {
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX);

    element.style.left = startX + 'px';
    element.style.top = startY + 'px';
    element.style.width = length + 'px';
    element.style.height = '2px';
    element.style.background = '#007acc';
    element.style.transformOrigin = 'left center';
    element.style.transform = `rotate(${angle}rad)`;
  }

  private createRectangle(canvas: HTMLElement, element: HTMLElement, startX: number, startY: number, endX: number, endY: number) {
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);

    element.style.left = left + 'px';
    element.style.top = top + 'px';
    element.style.width = width + 'px';
    element.style.height = height + 'px';
    element.style.border = '2px solid #007acc';
    element.style.background = 'rgba(0, 122, 204, 0.1)';
  }

  private createCircle(canvas: HTMLElement, element: HTMLElement, startX: number, startY: number, endX: number, endY: number) {
    const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    element.style.left = (startX - radius) + 'px';
    element.style.top = (startY - radius) + 'px';
    element.style.width = (radius * 2) + 'px';
    element.style.height = (radius * 2) + 'px';
    element.style.border = '2px solid #007acc';
    element.style.background = 'rgba(0, 122, 204, 0.1)';
    element.style.borderRadius = '50%';
  }

  private createArrow(canvas: HTMLElement, element: HTMLElement, startX: number, startY: number, endX: number, endY: number) {
    this.createLine(canvas, element, startX, startY, endX, endY);
    element.style.borderRight = '8px solid transparent';
    element.style.borderLeft = '8px solid transparent';
    element.style.borderTop = '8px solid #007acc';
    element.style.width = '0';
    element.style.height = '0';
    element.style.left = endX + 'px';
    element.style.top = endY + 'px';
    element.style.transform = `rotate(${Math.atan2(endY - startY, endX - startX)}rad)`;
  }

  private createTextElement(canvasId: string, x: number, y: number) {
    const canvas = document.getElementById(`excalidraw-canvas-${canvasId}`);
    if (!canvas) return;

    const textArea = document.createElement('textarea');
    textArea.className = 'drawing-element';
    textArea.style.position = 'absolute';
    textArea.style.left = x + 'px';
    textArea.style.top = y + 'px';
    textArea.style.border = 'none';
    textArea.style.background = 'transparent';
    textArea.style.color = '#333';
    textArea.style.fontSize = '14px';
    textArea.style.padding = '4px';
    textArea.style.minWidth = '20px';
    textArea.style.minHeight = '20px';
    textArea.style.resize = 'none';
    textArea.style.outline = 'none';
    textArea.style.fontFamily = 'inherit';
    textArea.placeholder = '输入文本...';

    textArea.addEventListener('blur', () => {
      if (!textArea.value.trim()) {
        textArea.remove();
      }
    });

    textArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        textArea.blur();
      }
    });

    canvas.appendChild(textArea);
    textArea.focus();
  }

  private updateDrawingPreview(canvasId: string, currentX: number, currentY: number) {
    this.clearPreview(canvasId);
    
    const state = this.canvasStates.get(canvasId);
    if (!state || state.currentTool === 'pen') return;

    const canvas = document.getElementById(`excalidraw-canvas-${canvasId}`);
    if (!canvas) return;

    const preview = document.createElement('div');
    preview.className = 'drawing-element';
    preview.style.position = 'absolute';
    preview.style.pointerEvents = 'none';
    preview.style.opacity = '0.5';

    switch (state.currentTool) {
      case 'line':
        this.createLine(canvas, preview, state.startX, state.startY, currentX, currentY);
        break;
      case 'rectangle':
        this.createRectangle(canvas, preview, state.startX, state.startY, currentX, currentY);
        break;
      case 'circle':
        this.createCircle(canvas, preview, state.startX, state.startY, currentX, currentY);
        break;
      case 'arrow':
        this.createArrow(canvas, preview, state.startX, state.startY, currentX, currentY);
        break;
    }

    if (preview.style.width || preview.style.height) {
      preview.id = `drawing-preview-${canvasId}`;
      canvas.appendChild(preview);
    }
  }

  private clearPreview(canvasId: string) {
    const preview = document.getElementById(`drawing-preview-${canvasId}`);
    if (preview) {
      preview.remove();
    }
  }

  private generateCanvasHTML(): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Excalidraw 画布</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, sans-serif; background: #f5f5f5; }
        .container { display: flex; height: 100vh; }
        .toolbar { width: 60px; background: #2a2d2e; padding: 16px 8px; display: flex; flex-direction: column; gap: 8px; }
        .tool-button { width: 40px; height: 40px; border: 1px solid #3c3c3c; border-radius: 6px; background: #2a2d2e; color: #cccccc; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
        .tool-button:hover { background: #3c3c3c; border-color: #007acc; }
        .tool-button.active { background: #007acc; border-color: #007acc; color: white; }
        .canvas-area { flex: 1; background: #ffffff; position: relative; }
        .canvas { width: 100%; height: 100%; cursor: crosshair; position: relative; }
        .canvas-grid { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px); background-size: 20px 20px; pointer-events: none; }
        .drawing-element { position: absolute; pointer-events: none; }
        .line { background: #007acc; height: 2px; transform-origin: left center; }
        .shape { border: 2px solid #007acc; background: rgba(0, 122, 204, 0.1); }
        .status-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 30px; background: #2a2d2e; color: #cccccc; display: flex; align-items: center; padding: 0 16px; font-size: 12px; border-top: 1px solid #3c3c3c; }
        .clear-button { background: #d73a49; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="toolbar">
            <button class="tool-button active" title="画笔" data-tool="pen">✏️</button>
            <button class="tool-button" title="直线" data-tool="line">📏</button>
            <button class="tool-button" title="矩形" data-tool="rectangle">⬜</button>
            <button class="tool-button" title="圆形" data-tool="circle">⭕</button>
            <button class="tool-button" title="文本" data-tool="text">💬</button>
            <button class="tool-button" title="箭头" data-tool="arrow">➡️</button>
        </div>
        <div class="canvas-area">
            <div class="canvas" id="excalidraw-canvas">
                <div class="canvas-grid"></div>
            </div>
            <div class="status-bar">
                <div id="coordinates">坐标: 0, 0</div>
                <div id="tool-info" style="flex: 1; margin-left: 16px;">当前工具: 画笔</div>
                <button class="clear-button" id="clear-button">清除画布</button>
            </div>
        </div>
    </div>
    <script>
        class ExcalidrawCanvas {
            constructor() {
                this.canvas = document.getElementById('excalidraw-canvas');
                this.toolButtons = document.querySelectorAll('.tool-button');
                this.coordinates = document.getElementById('coordinates');
                this.toolInfo = document.getElementById('tool-info');
                this.clearButton = document.getElementById('clear-button');
                
                this.currentTool = 'pen';
                this.isDrawing = false;
                this.startX = 0;
                this.startY = 0;
                this.elements = [];
                
                this.initializeEventListeners();
            }
            
            initializeEventListeners() {
                this.toolButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        this.selectTool(e.target.dataset.tool);
                    });
                });
                
                this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
                this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
                this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
                
                this.clearButton.addEventListener('click', () => this.clearCanvas());
                
                this.canvas.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const x = Math.round(e.clientX - rect.left);
                    const y = Math.round(e.clientY - rect.top);
                    this.coordinates.textContent = \`坐标: \${x}, \${y}\`;
                });
            }
            
            selectTool(tool) {
                this.currentTool = tool;
                this.toolButtons.forEach(button => {
                    button.classList.remove('active');
                    if (button.dataset.tool === tool) {
                        button.classList.add('active');
                    }
                });
                
                const toolNames = { pen: '画笔', line: '直线', rectangle: '矩形', circle: '圆形', text: '文本', arrow: '箭头' };
                this.toolInfo.textContent = \`当前工具: \${toolNames[tool]}\`;
                this.canvas.style.cursor = tool === 'text' ? 'text' : 'crosshair';
            }
            
            handleMouseDown(e) {
                this.isDrawing = true;
                const rect = this.canvas.getBoundingClientRect();
                this.startX = e.clientX - rect.left;
                this.startY = e.clientY - rect.top;
                
                if (this.currentTool === 'text') {
                    this.createTextElement(this.startX, this.startY);
                }
            }
            
            handleMouseMove(e) {
                if (!this.isDrawing) return;
                const rect = this.canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                this.updateDrawingPreview(currentX, currentY);
            }
            
            handleMouseUp(e) {
                if (!this.isDrawing) return;
                const rect = this.canvas.getBoundingClientRect();
                const endX = e.clientX - rect.left;
                const endY = e.clientY - rect.top;
                this.createElement(this.startX, this.startY, endX, endY);
                this.isDrawing = false;
                this.clearPreview();
            }
            
            createElement(startX, startY, endX, endY) {
                const element = document.createElement('div');
                element.className = 'drawing-element';
                
                switch (this.currentTool) {
                    case 'pen':
                        this.createPenStroke(startX, startY, endX, endY);
                        break;
                    case 'line':
                        this.createLine(element, startX, startY, endX, endY);
                        break;
                    case 'rectangle':
                        this.createRectangle(element, startX, startY, endX, endY);
                        break;
                    case 'circle':
                        this.createCircle(element, startX, startY, endX, endY);
                        break;
                    case 'arrow':
                        this.createArrow(element, startX, startY, endX, endY);
                        break;
                }
                
                if (element.style.width || element.style.height) {
                    this.canvas.appendChild(element);
                    this.elements.push(element);
                }
            }
            
            createPenStroke(startX, startY, endX, endY) {
                const line = document.createElement('div');
                line.className = 'drawing-element line';
                const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                const angle = Math.atan2(endY - startY, endX - startX);
                line.style.left = startX + 'px';
                line.style.top = startY + 'px';
                line.style.width = length + 'px';
                line.style.transform = \`rotate(\${angle}rad)\`;
                this.canvas.appendChild(line);
                this.elements.push(line);
            }
            
            createLine(element, startX, startY, endX, endY) {
                const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                const angle = Math.atan2(endY - startY, endX - startX);
                element.style.left = startX + 'px';
                element.style.top = startY + 'px';
                element.style.width = length + 'px';
                element.style.height = '2px';
                element.style.backgroundColor = '#007acc';
                element.style.transformOrigin = 'left center';
                element.style.transform = \`rotate(\${angle}rad)\`;
            }
            
            createRectangle(element, startX, startY, endX, endY) {
                const width = Math.abs(endX - startX);
                const height = Math.abs(endY - startY);
                const left = Math.min(startX, endX);
                const top = Math.min(startY, endY);
                element.style.left = left + 'px';
                element.style.top = top + 'px';
                element.style.width = width + 'px';
                element.style.height = height + 'px';
                element.style.border = '2px solid #007acc';
                element.style.backgroundColor = 'rgba(0, 122, 204, 0.1)';
            }
            
            createCircle(element, startX, startY, endX, endY) {
                const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                element.style.left = (startX - radius) + 'px';
                element.style.top = (startY - radius) + 'px';
                element.style.width = (radius * 2) + 'px';
                element.style.height = (radius * 2) + 'px';
                element.style.border = '2px solid #007acc';
                element.style.backgroundColor = 'rgba(0, 122, 204, 0.1)';
                element.style.borderRadius = '50%';
            }
            
            createArrow(element, startX, startY, endX, endY) {
                this.createLine(element, startX, startY, endX, endY);
                element.style.borderRight = '8px solid transparent';
                element.style.borderLeft = '8px solid transparent';
                element.style.borderTop = '8px solid #007acc';
                element.style.width = '0';
                element.style.height = '0';
                element.style.left = endX + 'px';
                element.style.top = endY + 'px';
                element.style.transform = \`rotate(\${Math.atan2(endY - startY, endX - startX)}rad)\`;
            }
            
            createTextElement(x, y) {
                const textArea = document.createElement('textarea');
                textArea.className = 'drawing-element';
                textArea.style.left = x + 'px';
                textArea.style.top = y + 'px';
                textArea.style.position = 'absolute';
                textArea.style.border = 'none';
                textArea.style.background = 'transparent';
                textArea.style.color = '#333';
                textArea.style.fontSize = '14px';
                textArea.style.padding = '4px';
                textArea.style.minWidth = '20px';
                textArea.style.minHeight = '20px';
                textArea.style.resize = 'none';
                textArea.style.outline = 'none';
                textArea.style.fontFamily = 'inherit';
                textArea.placeholder = '输入文本...';
                
                textArea.addEventListener('blur', () => {
                    if (!textArea.value.trim()) {
                        textArea.remove();
                    }
                });
                
                textArea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        textArea.blur();
                    }
                });
                
                this.canvas.appendChild(textArea);
                textArea.focus();
                this.elements.push(textArea);
            }
            
            updateDrawingPreview(currentX, currentY) {
                this.clearPreview();
                if (this.currentTool === 'pen') return;
                
                const preview = document.createElement('div');
                preview.className = 'drawing-element';
                preview.style.opacity = '0.5';
                
                switch (this.currentTool) {
                    case 'line':
                        this.createLine(preview, this.startX, this.startY, currentX, currentY);
                        break;
                    case 'rectangle':
                        this.createRectangle(preview, this.startX, this.startY, currentX, currentY);
                        break;
                    case 'circle':
                        this.createCircle(preview, this.startX, this.startY, currentX, currentY);
                        break;
                    case 'arrow':
                        this.createArrow(preview, this.startX, this.startY, currentX, currentY);
                        break;
                }
                
                if (preview.style.width || preview.style.height) {
                    preview.id = 'drawing-preview';
                    this.canvas.appendChild(preview);
                }
            }
            
            clearPreview() {
                const preview = document.getElementById('drawing-preview');
                if (preview) {
                    preview.remove();
                }
            }
            
            clearCanvas() {
                this.elements.forEach(element => element.remove());
                this.elements = [];
                this.clearPreview();
            }
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            new ExcalidrawCanvas();
        });
    </script>
</body>
</html>`;
  }

  private showNotice(message: string) {
    const notice = document.createElement('div');
    notice.textContent = message;
    notice.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007acc;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      z-index: 10000;
      font-family: -apple-system, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(notice);
    setTimeout(() => {
      if (notice.parentNode) {
        notice.parentNode.removeChild(notice);
      }
    }, 3000);
  }
}
