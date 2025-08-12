import { Plugin, App, TFile, MarkdownPostProcessor, MarkdownPostProcessorContext } from '../../core/pluginSystem/ObsidianCompatiblePluginManager';

export class ObsidianExamplePlugin extends Plugin {
  private statusBarItem: HTMLElement | null = null;
  private ribbonIcon: HTMLElement | null = null;

  async onload() {
    console.log('Obsidian Example Plugin loaded!');

    // 添加状态栏项目
    this.statusBarItem = this.addStatusBarItem();
    this.statusBarItem.setText('📝 Obsidian Example Plugin');

    // 添加命令
    this.addCommand({
      id: 'obsidian-example-hello',
      name: 'Say Hello',
      callback: () => {
        console.log('Hello from Obsidian Example Plugin!');
        this.showNotice('Hello from Obsidian Example Plugin!');
      }
    });

    // 添加设置标签页
    this.addSettingTab(new ObsidianExampleSettingTab(this.app, this));

    // 注册 Markdown 后处理器
    this.registerMarkdownPostProcessor({
      type: 'markdown',
      process: (element: HTMLElement, context: MarkdownPostProcessorContext) => {
        this.processMarkdown(element, context);
      }
    });

    // 注册代码块处理器
    this.registerMarkdownCodeBlockProcessor('obsidian-example', 
      (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
        this.processCodeBlock(source, el, ctx);
      }
    );

    // 监听文件打开事件
    this.registerEvent(
      this.app.workspace.onFileOpen((file: TFile) => {
        console.log('File opened:', file.path);
        this.updateStatusBar(`当前文件: ${file.name}`);
      })
    );

    // 保存一些插件数据
    await this.saveData({
      lastLoadTime: new Date().toISOString(),
      loadCount: (await this.loadData())?.loadCount || 0 + 1
    });

    console.log('Obsidian Example Plugin initialization completed');
  }

  override async onunload() {
    console.log('Obsidian Example Plugin unloading...');

    // 清理状态栏项目
    if (this.statusBarItem) {
      this.statusBarItem.remove();
    }

    // 清理图标
    if (this.ribbonIcon) {
      this.ribbonIcon.remove();
    }

    console.log('Obsidian Example Plugin unloaded');
  }

  private processMarkdown(element: HTMLElement, context: MarkdownPostProcessorContext) {
    // 查找所有标题元素
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      const span = document.createElement('span');
      span.textContent = ` [${index + 1}]`;
      span.style.color = '#007acc';
      span.style.fontSize = '0.8em';
      heading.appendChild(span);
    });
  }

  private processCodeBlock(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
    // 清空容器
    el.empty();

    // 创建代码块容器
    const container = el.createDiv({ cls: 'obsidian-example-code-block' });
    
    // 添加标题
    const title = container.createDiv({ cls: 'code-block-title' });
    title.setText('Obsidian Example Code Block');
    
    // 添加内容
    const content = container.createDiv({ cls: 'code-block-content' });
    content.setText(source);
    
    // 添加处理按钮
    const button = container.createEl('button', { text: 'Process Code' });
    button.onclick = () => {
      this.processCode(source);
    };

    // 添加样式
    container.setCssStyles({
      border: '1px solid #3c3c3c',
      borderRadius: '4px',
      padding: '12px',
      margin: '8px 0',
      backgroundColor: '#1e1e1e'
    });

    title.setCssStyles({
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#007acc'
    });

    content.setCssStyles({
      fontFamily: 'monospace',
      backgroundColor: '#2d2d30',
      padding: '8px',
      borderRadius: '2px',
      marginBottom: '8px'
    });

    button.setCssStyles({
      backgroundColor: '#007acc',
      color: 'white',
      border: 'none',
      padding: '4px 8px',
      borderRadius: '2px',
      cursor: 'pointer'
    });
  }

  private processCode(source: string) {
    console.log('Processing code:', source);
    this.showNotice(`处理了 ${source.length} 个字符的代码`);
  }

  private updateStatusBar(text: string) {
    if (this.statusBarItem) {
      this.statusBarItem.setText(text);
    }
  }

  public showNotice(message: string) {
    // 创建通知元素
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(notice);

    // 3秒后自动移除
    setTimeout(() => {
      if (notice.parentNode) {
        notice.parentNode.removeChild(notice);
      }
    }, 3000);
  }
}

// 设置标签页类
class ObsidianExampleSettingTab {
  private app: App;
  private plugin: ObsidianExamplePlugin;
  public id: string = 'obsidian-example-settings';
  public name: string = 'Obsidian Example';
  public tab: HTMLElement;

  constructor(app: App, plugin: ObsidianExamplePlugin) {
    this.app = app;
    this.plugin = plugin;
    this.tab = this.createSettingsTab();
  }

  private createSettingsTab(): HTMLElement {
    const container = document.createElement('div');
    container.style.cssText = `
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // 标题
    const title = container.createEl('h2', { text: 'Obsidian Example Plugin Settings' });
    title.style.marginBottom = '20px';

    // 设置项
    const settingContainer = container.createDiv();
    settingContainer.style.marginBottom = '16px';

    // 示例设置
    const settingLabel = settingContainer.createEl('label', { text: '示例设置:' });
    settingLabel.style.display = 'block';
    settingLabel.style.marginBottom = '8px';

    const settingInput = settingContainer.createEl('input', { type: 'text' });
    settingInput.placeholder = '输入设置值';
    settingInput.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #3c3c3c;
      border-radius: 4px;
      background: #1e1e1e;
      color: #cccccc;
    `;

    // 按钮
    const buttonContainer = container.createDiv();
    buttonContainer.style.marginTop = '20px';

    const testButton = buttonContainer.createEl('button', { text: '测试功能' });
    testButton.style.cssText = `
      background: #007acc;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 8px;
    `;
    testButton.onclick = () => {
      this.plugin.showNotice('测试功能已执行！');
    };

    const resetButton = buttonContainer.createEl('button', { text: '重置设置' });
    resetButton.style.cssText = `
      background: #d73a49;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    `;
    resetButton.onclick = () => {
      settingInput.value = '';
      this.plugin.showNotice('设置已重置！');
    };

    return container;
  }
}
