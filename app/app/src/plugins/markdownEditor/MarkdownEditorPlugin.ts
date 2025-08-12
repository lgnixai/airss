import { IPluginAPI, IPluginClass } from '../../core/pluginSystem/types';

export class MarkdownEditorPlugin implements IPluginClass {
  private api: IPluginAPI | null = null;
  private ribbonIcon: HTMLElement | null = null;

  async onload(api: IPluginAPI) {
    this.api = api;
    
    // 添加工具栏图标
    this.api.ui.addRibbonIcon('file-text', '新建 Markdown 文件', () => {
      this.createNewMarkdownFile();
    });

    // 注册 Markdown 文件类型
    this.registerMarkdownFileType();

    // 监听文件打开事件
    this.api.events.on('file:opened', (filePath: string) => {
      if (filePath.endsWith('.md')) {
        this.openMarkdownEditor(filePath);
      }
    });

    console.log('Markdown Editor Plugin loaded');
  }

  async onunload() {
    if (this.ribbonIcon) {
      this.ribbonIcon.remove();
    }
    
    console.log('Markdown Editor Plugin unloaded');
  }

  private async createNewMarkdownFile() {
    if (!this.api) return;

    const fileName = `note_${Date.now()}.md`;
    const content = `# 新笔记

在这里开始写作...

## 功能特性

- 支持 Markdown 语法
- 实时预览
- 自动保存
- 标签管理

## 使用提示

使用 \`Ctrl+S\` 保存文件
使用 \`Ctrl+Shift+V\` 切换预览模式
`;

    try {
      await this.api.fileSystem.writeFile(fileName, content);
      this.api.events.emit('file:created', fileName);
    } catch (error) {
      console.error('Failed to create markdown file:', error);
    }
  }

  private registerMarkdownFileType() {
    if (!this.api) return;

    // 注册 Markdown 文件类型处理
    this.api.events.on('file:type:md', (filePath: string) => {
      this.openMarkdownEditor(filePath);
    });
  }

  private async openMarkdownEditor(filePath: string) {
    if (!this.api) return;

    try {
      const content = await this.api.fileSystem.readFile(filePath);
      
      // 创建编辑器视图
      const editorView = {
        id: `markdown-editor-${filePath}`,
        title: filePath,
        render: () => this.createEditorComponent(content, filePath)
      };

      this.api.ui.registerView(editorView.id, editorView);
      
    } catch (error) {
      console.error('Failed to open markdown file:', error);
    }
  }

  private createEditorComponent(content: string, filePath: string) {
    // 这里应该返回一个 React 组件
    // 暂时返回一个简单的 div
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="padding: 20px;">
        <h3>Markdown Editor: ${filePath}</h3>
        <textarea 
          style="width: 100%; height: 400px; font-family: monospace;"
          placeholder="在这里编写 Markdown 内容..."
        >${content}</textarea>
        <div style="margin-top: 10px;">
          <button onclick="this.saveContent()">保存</button>
          <button onclick="this.togglePreview()">预览</button>
        </div>
      </div>
    `;
    return div;
  }
} 