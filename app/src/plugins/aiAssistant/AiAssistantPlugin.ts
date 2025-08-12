import { IPluginAPI, IPluginClass } from '../../core/pluginSystem/types';

export class AiAssistantPlugin implements IPluginClass {
  private api: IPluginAPI | null = null;
  private currentArticle: any = null;
  private currentTabContent: string = '';

  async onload(api: IPluginAPI) {
    this.api = api;
    console.log('AI Assistant Plugin loaded successfully!');
    
    // 监听编辑器标签页切换事件
    if (this.api && this.api.molecule && this.api.molecule.editor) {
      this.api.molecule.editor.onSelectTab((tabId: string, groupId: string) => {
        this.updateCurrentTabContent(tabId, groupId);
      });
    }
    
    setTimeout(() => {
      this.addAiAssistantToAuxiliaryBar();
    }, 2000);
  }

  async onunload() {
    console.log('AI Assistant Plugin unloaded');
  }

  private addAiAssistantToAuxiliaryBar() {
    // 使用 Molecule 的 AuxiliaryBar API
    if (this.api && this.api.ui) {
      try {
        // 显示 AuxiliaryBar
        if (this.api.ui.setAuxiliaryBar) {
          this.api.ui.setAuxiliaryBar(true);
        }
        
        // 添加 AI 助手到 AuxiliaryBar
        if (this.api.ui.addAuxiliaryBarItem) {
          this.api.ui.addAuxiliaryBarItem({
            id: 'ai-assistant',
            name: 'AI 助手',
            icon: 'lightbulb',
            render: () => this.createAiAssistantContent()
          });
          
          // 设置为当前激活的 AuxiliaryBar
          if (this.api.ui.setCurrentAuxiliaryBar) {
            this.api.ui.setCurrentAuxiliaryBar('ai-assistant');
          }
          
          console.log('AI Assistant added to auxiliary bar via API');
          return;
        }
      } catch (error) {
        console.error('Failed to add AI Assistant via API:', error);
      }
    }
    
    // 如果 API 不可用，尝试 DOM 操作
    console.log('Falling back to DOM manipulation for auxiliary bar');
    this.addAiAssistantToAuxiliaryBarViaDOM();
  }

  private addAiAssistantToAuxiliaryBarViaDOM() {
    // 尝试多种选择器来找到 AuxiliaryBar
    let auxiliaryBar = document.querySelector('[data-testid="auxiliaryBar"]') || 
                      document.querySelector('.auxiliaryBar') ||
                      document.querySelector('[class*="auxiliary"]') ||
                      document.querySelector('[class*="AuxiliaryBar"]') ||
                      document.querySelector('[class*="auxiliaryBar"]');
    
    // 如果找不到，尝试创建或查找右侧面板
    if (!auxiliaryBar) {
      // 查找主容器
      const mainContainer = document.querySelector('[data-testid="workbench"]') ||
                           document.querySelector('.workbench') ||
                           document.querySelector('[class*="workbench"]');
      
      if (mainContainer) {
        // 查找或创建右侧面板
        auxiliaryBar = mainContainer.querySelector('[class*="auxiliary"]') ||
                      mainContainer.querySelector('[class*="right"]') ||
                      mainContainer.querySelector('[class*="panel"]');
        
        if (!auxiliaryBar) {
          // 创建新的 AuxiliaryBar
          auxiliaryBar = document.createElement('div');
          auxiliaryBar.className = 'auxiliary-bar ai-assistant-panel';
          (auxiliaryBar as HTMLElement).style.cssText = `
            position: fixed;
            right: 0;
            top: 0;
            width: 300px;
            height: 100vh;
            background-color: var(--vscode-sideBar-background, #252526);
            border-left: 1px solid var(--vscode-sideBar-border, #3c3c3c);
            z-index: 1000;
            display: flex;
            flex-direction: column;
          `;
          document.body.appendChild(auxiliaryBar);
        }
      }
    }
    
    if (auxiliaryBar) {
      console.log('Found or created auxiliary bar via DOM:', auxiliaryBar);
      const aiContent = this.createAiAssistantContent();
      
      // 清空现有内容并添加 AI 助手
      auxiliaryBar.innerHTML = '';
      auxiliaryBar.appendChild(aiContent);
      
      // 确保 AuxiliaryBar 可见
      (auxiliaryBar as HTMLElement).style.display = 'flex';
      (auxiliaryBar as HTMLElement).style.width = '300px';
      (auxiliaryBar as HTMLElement).style.minWidth = '300px';
      (auxiliaryBar as HTMLElement).style.maxWidth = '400px';
      
      console.log('AI Assistant added to auxiliary bar via DOM');
    } else {
      console.log('Auxiliary bar not found, retrying...');
      setTimeout(() => this.addAiAssistantToAuxiliaryBarViaDOM(), 1000);
    }
  }

  private createAiAssistantContent() {
    const container = document.createElement('div');
    container.style.cssText = `
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--vscode-sideBar-background, #252526);
      color: var(--vscode-sideBar-foreground, #cccccc);
    `;

    // 标题栏
    const header = document.createElement('div');
    header.style.cssText = `
      padding: 12px 16px;
      border-bottom: 1px solid var(--vscode-sideBar-border, #3c3c3c);
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;
    header.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">🤖</span>
        <span style="font-weight: bold; font-size: 14px;">AI 助手</span>
      </div>
      <button id="ai-settings-btn" style="
        background: none;
        border: none;
        color: var(--vscode-foreground, #cccccc);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        font-size: 12px;
      " title="设置">⚙️</button>
    `;
    
    // 设置按钮事件
    const settingsBtn = header.querySelector('#ai-settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        this.showSettings();
      });
    }
    
    container.appendChild(header);

    // 当前文章信息
    const articleInfo = document.createElement('div');
    articleInfo.style.cssText = `
      padding: 12px 16px;
      border-bottom: 1px solid var(--vscode-sideBar-border, #3c3c3c);
      background-color: var(--vscode-list-hoverBackground, #2a2d2e);
    `;
    articleInfo.innerHTML = `
      <div style="font-size: 12px; color: var(--vscode-descriptionForeground, #cccccc80); margin-bottom: 4px;">
        当前文章
      </div>
      <div id="current-article-title" style="font-size: 13px; font-weight: 500;">
        未选择文章
      </div>
    `;
    container.appendChild(articleInfo);

    // AI 操作按钮
    const actionsContainer = document.createElement('div');
    actionsContainer.style.cssText = `
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;

    const actions = [
      { id: 'summarize', label: '📝 总结文章', icon: '📝' },
      { id: 'translate', label: '🌐 翻译内容', icon: '🌐' },
      { id: 'explain', label: '💡 解释概念', icon: '💡' },
      { id: 'code-review', label: '🔍 代码审查', icon: '🔍' },
      { id: 'optimize', label: '⚡ 优化建议', icon: '⚡' },
      { id: 'chat', label: '💬 自由对话', icon: '💬' }
    ];

    actions.forEach(action => {
      const button = document.createElement('button');
      button.style.cssText = `
        width: 100%;
        padding: 8px 12px;
        background-color: var(--vscode-button-background, #0e639c);
        color: var(--vscode-button-foreground, #ffffff);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: background-color 0.2s;
      `;
      
      button.onclick = () => {
        this.handleAiAction(action.id);
      };
      
      button.innerHTML = `
        <span>${action.icon}</span>
        <span>${action.label}</span>
      `;
      
      actionsContainer.appendChild(button);
    });

    container.appendChild(actionsContainer);

    // 聊天区域
    const chatContainer = document.createElement('div');
    chatContainer.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--vscode-sideBar-border, #3c3c3c);
    `;

    const chatHeader = document.createElement('div');
    chatHeader.style.cssText = `
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 500;
      border-bottom: 1px solid var(--vscode-sideBar-border, #3c3c3c);
    `;
    chatHeader.textContent = '💬 对话';
    chatContainer.appendChild(chatHeader);

    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'ai-messages';
    messagesContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;
    chatContainer.appendChild(messagesContainer);

    // 聊天输入区域
    const chatInputContainer = document.createElement('div');
    chatInputContainer.style.cssText = `
      padding: 8px;
      border-top: 1px solid var(--vscode-sideBar-border, #3c3c3c);
      display: flex;
      gap: 4px;
    `;

    const input = document.createElement('input');
    input.id = 'ai-chat-input';
    input.placeholder = '输入问题...';
    input.style.cssText = `
      flex: 1;
      padding: 6px 8px;
      border: 1px solid var(--vscode-input-border, #3c3c3c);
      border-radius: 4px;
      background-color: var(--vscode-input-background, #3c3c3c);
      color: var(--vscode-input-foreground, #cccccc);
      font-size: 12px;
    `;

    const sendButton = document.createElement('button');
    sendButton.textContent = '发送';
    sendButton.style.cssText = `
      padding: 6px 12px;
      background-color: var(--vscode-button-background, #0e639c);
      color: var(--vscode-button-foreground, #ffffff);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;

    // 发送消息事件
    const sendMessage = () => {
      const message = input.value.trim();
      if (message) {
        this.addMessage('👤', message, 'user');
        this.handleChatMessage(message);
        input.value = '';
      }
    };

    sendButton.onclick = sendMessage;
    input.onkeypress = (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    };

    chatInputContainer.appendChild(input);
    chatInputContainer.appendChild(sendButton);
    chatContainer.appendChild(chatInputContainer);

    container.appendChild(chatContainer);

    // 添加欢迎消息
    setTimeout(() => {
      this.addMessage('🤖', '你好！我是AI助手，可以帮助你总结文章、翻译内容、解释概念、审查代码等。请选择上方功能或直接输入问题。', 'assistant');
    }, 500);

    return container;
  }

  private handleAiAction(actionId: string) {
    // 优先使用当前标签页的内容，如果没有则使用当前文章
    const content = this.currentTabContent || (this.currentArticle ? this.currentArticle.content : '');
    
    if (!content) {
      this.addMessage('🤖', '请先打开一篇文章或选择有内容的标签页', 'assistant');
      return;
    }

    const actions = {
      summarize: () => this.summarizeContent(content),
      translate: () => this.translateContent(content),
      explain: () => this.explainContent(content),
      'code-review': () => this.codeReviewContent(content),
      optimize: () => this.optimizeContent(content),
      chat: () => this.startChatMode()
    };

    if (actions[actionId as keyof typeof actions]) {
      actions[actionId as keyof typeof actions]();
    }
  }

  private handleChatMessage(message: string) {
    // 处理自由对话消息
    this.addMessage('🤖', '正在思考...', 'assistant');
    
    // 构建上下文
    const context = this.currentTabContent || (this.currentArticle ? this.currentArticle.content : '');
    const fullPrompt = context ? 
      `基于以下内容回答问题：\n\n${context}\n\n问题：${message}` :
      `问题：${message}`;
    
    this.callOllamaAPI('chat', fullPrompt).then(response => {
      // 更新最后一条消息
      const messagesContainer = document.getElementById('ai-messages');
      if (messagesContainer && messagesContainer.lastElementChild) {
        const lastMessage = messagesContainer.lastElementChild as HTMLElement;
        const contentDiv = lastMessage.querySelector('div:last-child');
        if (contentDiv) {
          contentDiv.textContent = response;
        }
      }
    }).catch(error => {
      this.addMessage('🤖', '抱歉，我无法回答这个问题。', 'assistant');
    });
  }

  private async summarizeContent(content: string) {
    this.addMessage('🤖', '正在总结内容...', 'assistant');
    
    try {
      const summary = await this.callOllamaAPI('summarize', content);
      this.addMessage('🤖', summary, 'assistant');
    } catch (error) {
      this.addMessage('🤖', '总结失败，请检查 Ollama 服务是否运行', 'assistant');
    }
  }

  private async translateContent(content: string) {
    this.addMessage('🤖', '正在翻译内容...', 'assistant');
    
    try {
      const translation = await this.callOllamaAPI('translate', content);
      this.addMessage('🤖', translation, 'assistant');
    } catch (error) {
      this.addMessage('🤖', '翻译失败，请检查 Ollama 服务是否运行', 'assistant');
    }
  }

  private async explainContent(content: string) {
    this.addMessage('🤖', '正在解释内容中的概念...', 'assistant');
    
    try {
      const explanation = await this.callOllamaAPI('explain', content);
      this.addMessage('🤖', explanation, 'assistant');
    } catch (error) {
      this.addMessage('🤖', '解释失败，请检查 Ollama 服务是否运行', 'assistant');
    }
  }

  private async codeReviewContent(content: string) {
    this.addMessage('🤖', '正在进行代码审查...', 'assistant');
    
    try {
      const review = await this.callOllamaAPI('code-review', content);
      this.addMessage('🤖', review, 'assistant');
    } catch (error) {
      this.addMessage('🤖', '代码审查失败，请检查 Ollama 服务是否运行', 'assistant');
    }
  }

  private async optimizeContent(content: string) {
    this.addMessage('🤖', '正在分析并提供优化建议...', 'assistant');
    
    try {
      const optimization = await this.callOllamaAPI('optimize', content);
      this.addMessage('🤖', optimization, 'assistant');
    } catch (error) {
      this.addMessage('🤖', '优化分析失败，请检查 Ollama 服务是否运行', 'assistant');
    }
  }

  private startChatMode() {
    this.addMessage('🤖', '已进入自由对话模式，您可以在下方输入框中提问。', 'assistant');
    // 聚焦到输入框
    const input = document.getElementById('ai-chat-input') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

  private async callOllamaAPI(action: string, content: string) {
    // 从 localStorage 获取设置
    const baseUrl = localStorage.getItem('ai-assistant-ollama-url') || 'http://localhost:11434';
    const model = localStorage.getItem('ai-assistant-ollama-model') || 'qwen2.5:latest';
    
    let prompt = '';
    switch (action) {
      case 'summarize':
        prompt = `请总结以下文章的主要内容，用中文回答：\n\n${content}`;
        break;
      case 'translate':
        prompt = `请将以下文章翻译成中文：\n\n${content}`;
        break;
      case 'explain':
        prompt = `请解释以下文章中提到的技术概念，用通俗易懂的中文回答：\n\n${content}`;
        break;
      case 'code-review':
        prompt = `请对以下代码进行审查，指出潜在问题、改进建议和最佳实践，用中文回答：\n\n${content}`;
        break;
      case 'optimize':
        prompt = `请分析以下内容并提供优化建议，包括性能、可读性、安全性等方面，用中文回答：\n\n${content}`;
        break;
      case 'chat':
        prompt = content; // 直接使用传入的内容作为提示
        break;
      default:
        prompt = content;
    }

    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error('Ollama API 请求失败');
    }

    const data = await response.json();
    return data.response || '抱歉，我无法生成回答。';
  }

  private addMessage(sender: string, content: string, type: 'user' | 'assistant') {
    const messagesContainer = document.getElementById('ai-messages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      line-height: 1.4;
      max-width: 100%;
      word-wrap: break-word;
    `;

    if (type === 'user') {
      messageDiv.style.backgroundColor = 'var(--vscode-button-background, #0e639c)';
      messageDiv.style.color = 'var(--vscode-button-foreground, #ffffff)';
      messageDiv.style.marginLeft = '20px';
    } else {
      messageDiv.style.backgroundColor = 'var(--vscode-list-hoverBackground, #2a2d2e)';
      messageDiv.style.color = 'var(--vscode-foreground, #cccccc)';
      messageDiv.style.marginRight = '20px';
    }

    messageDiv.innerHTML = `
      <div style="font-weight: 500; margin-bottom: 4px;">${sender}</div>
      <div>${content}</div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  public updateCurrentArticle(article: any) {
    this.currentArticle = article;
    const titleElement = document.getElementById('current-article-title');
    if (titleElement) {
      titleElement.textContent = article ? article.title : '未选择文章';
    }
  }

  private updateCurrentTabContent(tabId: string, groupId: string) {
    if (this.api && this.api.molecule && this.api.molecule.editor) {
      try {
        const tab = this.api.molecule.editor.getTab(tabId, groupId);
        if (tab && tab.value) {
          this.currentTabContent = typeof tab.value === 'string' ? tab.value : JSON.stringify(tab.value);
          console.log('Updated current tab content, length:', this.currentTabContent.length);
        }
      } catch (error) {
        console.error('Failed to update current tab content:', error);
      }
    }
  }

  private showSettings() {
    // 创建设置对话框
    const settingsDialog = document.createElement('div');
    settingsDialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--vscode-sideBar-background, #252526);
      border: 1px solid var(--vscode-sideBar-border, #3c3c3c);
      border-radius: 8px;
      padding: 20px;
      z-index: 10000;
      min-width: 400px;
      max-width: 500px;
    `;

    settingsDialog.innerHTML = `
      <div style="margin-bottom: 16px;">
        <h3 style="margin: 0; color: var(--vscode-foreground, #cccccc);">AI 助手设置</h3>
      </div>
      
      <div style="margin-bottom: 12px;">
        <label style="display: block; margin-bottom: 4px; color: var(--vscode-foreground, #cccccc);">
          Ollama 服务地址:
        </label>
        <input id="ollama-url" type="text" value="http://localhost:11434" style="
          width: 100%;
          padding: 6px 8px;
          border: 1px solid var(--vscode-input-border, #3c3c3c);
          border-radius: 4px;
          background-color: var(--vscode-input-background, #3c3c3c);
          color: var(--vscode-input-foreground, #cccccc);
        ">
      </div>
      
      <div style="margin-bottom: 12px;">
        <label style="display: block; margin-bottom: 4px; color: var(--vscode-foreground, #cccccc);">
          模型名称:
        </label>
        <input id="ollama-model" type="text" value="qwen2.5:latest" style="
          width: 100%;
          padding: 6px 8px;
          border: 1px solid var(--vscode-input-border, #3c3c3c);
          border-radius: 4px;
          background-color: var(--vscode-input-background, #3c3c3c);
          color: var(--vscode-input-foreground, #cccccc);
        ">
      </div>
      
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button id="save-settings" style="
          padding: 6px 12px;
          background-color: var(--vscode-button-background, #0e639c);
          color: var(--vscode-button-foreground, #ffffff);
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">保存</button>
        <button id="cancel-settings" style="
          padding: 6px 12px;
          background-color: var(--vscode-button-secondaryBackground, #3c3c3c);
          color: var(--vscode-button-secondaryForeground, #cccccc);
          border: none;
          border-radius: 4px;
          cursor: pointer;
        ">取消</button>
      </div>
    `;

    // 添加遮罩层
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(settingsDialog);

    // 事件处理
    const saveBtn = settingsDialog.querySelector('#save-settings');
    const cancelBtn = settingsDialog.querySelector('#cancel-settings');

    const closeDialog = () => {
      document.body.removeChild(overlay);
      document.body.removeChild(settingsDialog);
    };

    saveBtn?.addEventListener('click', () => {
      const url = (settingsDialog.querySelector('#ollama-url') as HTMLInputElement)?.value;
      const model = (settingsDialog.querySelector('#ollama-model') as HTMLInputElement)?.value;
      
      // 保存设置到 localStorage
      localStorage.setItem('ai-assistant-ollama-url', url || 'http://localhost:11434');
      localStorage.setItem('ai-assistant-ollama-model', model || 'qwen2.5:latest');
      
      this.addMessage('🤖', '设置已保存', 'assistant');
      closeDialog();
    });

    cancelBtn?.addEventListener('click', closeDialog);
    overlay.addEventListener('click', closeDialog);
  }
}