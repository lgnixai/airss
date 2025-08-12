import React, { useState, useRef, useEffect } from 'react';
import { testOllamaAPI, testOllamaPerformance } from '../tests/ollama-test';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface AiChatComponentProps {
  onSendMessage: (message: string) => void;
  onAiAction: (actionId: string) => void;
  currentArticle?: any;
  className?: string;
}

const AiChatComponent: React.FC<AiChatComponentProps> = ({
  onSendMessage,
  onAiAction,
  currentArticle,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `你好！我是你的AI助手，我已经准备就绪。

💡 **功能说明：**
• 📝 **总结文章**：一键生成专业文章总结
• 🌐 **翻译内容**：准确翻译为中文
• 💡 **解释概念**：通俗易懂的技术概念解释
• 🔍 **代码审查**：全面的代码质量分析
• ⚡ **优化建议**：专业的优化方案推荐
• 💬 **自由对话**：智能问答和讨论

请选择一篇文章或输入问题开始使用！`,
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 添加事件监听器来处理消息更新
  useEffect(() => {
    const handleMessageUpdate = (event: CustomEvent) => {
      const { type, content } = event.detail;
      
      if (type === 'success' || type === 'error') {
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: 'assistant',
          content: content,
          timestamp: new Date()
        };
        
        setMessages(prev => {
          // 如果最后一条消息是加载状态，替换它
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.isLoading) {
            return [...prev.slice(0, -1), newMessage];
          }
          return [...prev, newMessage];
        });
        
        setIsLoading(false);
      }
    };

    // 监听自定义事件
    window.addEventListener('ai:updateMessage', handleMessageUpdate as EventListener);
    
    return () => {
      window.removeEventListener('ai:updateMessage', handleMessageUpdate as EventListener);
    };
  }, []);

  const handleSendMessage = () => {
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: trimmedMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 添加加载消息
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      content: '正在思考...',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    // 调用父组件的发送消息函数
    onSendMessage(trimmedMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAiAction = (actionId: string) => {
    // 添加加载消息
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      content: '正在处理中，请稍候...',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, loadingMessage]);
    setIsLoading(true);
    
    onAiAction(actionId);
  };

  // 暴露给父组件的方法
  const componentRef = useRef<any>(null);
  
  React.useImperativeHandle(componentRef, () => ({
    addMessage: (sender: 'user' | 'assistant', content: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender,
        content,
        timestamp: new Date()
      };
      
      setMessages(prev => {
        // 如果最后一条消息是加载状态，替换它
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.isLoading) {
          return [...prev.slice(0, -1), newMessage];
        }
        return [...prev, newMessage];
      });
      
      setIsLoading(false);
    },
    setLoading: (loading: boolean) => {
      setIsLoading(loading);
    },
    addAiActionResult: (content: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'assistant',
        content,
        timestamp: new Date()
      };
      
      setMessages(prev => {
        // 如果最后一条消息是加载状态，替换它
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.isLoading) {
          return [...prev.slice(0, -1), newMessage];
        }
        return [...prev, newMessage];
      });
      
      setIsLoading(false);
    },
    // 新增：处理AI操作错误
    handleAiError: (error: string) => {
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: 'assistant',
        content: `❌ 操作失败：${error}`,
        timestamp: new Date()
      };
      
      setMessages(prev => {
        // 如果最后一条消息是加载状态，替换它
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.isLoading) {
          return [...prev.slice(0, -1), errorMessage];
        }
        return [...prev, errorMessage];
      });
      
      setIsLoading(false);
    }
  }));

  const aiActions = [
    { id: 'summarize', label: '📝 总结文章', icon: '📝' },
    { id: 'translate', label: '🌐 翻译内容', icon: '🌐' },
    { id: 'explain', label: '💡 解释概念', icon: '💡' },
    { id: 'code-review', label: '🔍 代码审查', icon: '🔍' },
    { id: 'optimize', label: '⚡ 优化建议', icon: '⚡' },
    { id: 'generate-code', label: '💻 生成代码', icon: '💻' },
    { id: 'chat', label: '💬 自由对话', icon: '💬' }
  ];

  return (
    <div className={`ai-chat-component ${className}`} style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--sideBar-background)',
      color: 'var(--sideBar-foreground)',
      overflow: 'hidden'
    }}>
      {/* 头部 */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--sideBar-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <div style={{ fontSize: '14px', fontWeight: '500' }}>
          🤖 AI 助手
        </div>
        <button
          onClick={() => {
            // 创建设置对话框
            const settingsDialog = document.createElement('div');
            settingsDialog.style.cssText = `
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: var(--sideBar-background);
              border: 1px solid var(--sideBar-border);
              border-radius: 8px;
              padding: 20px;
              z-index: 10000;
              min-width: 400px;
              max-width: 500px;
            `;

            settingsDialog.innerHTML = `
              <div style="margin-bottom: 16px;">
                <h3 style="margin: 0; color: var(--foreground);">AI 助手设置</h3>
              </div>
              
              <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px; color: var(--foreground);">
                  Ollama 服务地址:
                </label>
                <input id="ollama-url" type="text" value="${localStorage.getItem('ai-assistant-ollama-url') || 'http://localhost:11434'}" style="
                  width: 100%;
                  padding: 6px 8px;
                  border: 1px solid var(--input-border);
                  border-radius: 4px;
                  background-color: var(--input-background);
                  color: var(--input-foreground);
                ">
              </div>
              
              <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px; color: var(--foreground);">
                  模型名称:
                </label>
                <input id="ollama-model" type="text" value="${localStorage.getItem('ai-assistant-ollama-model') || 'qwen2.5:latest'}" style="
                  width: 100%;
                  padding: 6px 8px;
                  border: 1px solid var(--input-border);
                  border-radius: 4px;
                  background-color: var(--input-background);
                  color: var(--input-foreground);
                ">
              </div>
              
              <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button id="save-settings" style="
                  padding: 6px 12px;
                  background-color: var(--button-background);
                  color: var(--button-foreground);
                  border: none;
                  border-radius: 4px;
                  cursor: pointer;
                ">保存</button>
                <button id="cancel-settings" style="
                  padding: 6px 12px;
                  background-color: var(--button-secondaryBackground);
                  color: var(--button-secondaryForeground);
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
              
              // 添加成功消息
              const successMessage: Message = {
                id: Date.now().toString(),
                sender: 'assistant',
                content: '✅ 设置已保存',
                timestamp: new Date()
              };
              
              setMessages(prev => [...prev, successMessage]);
              closeDialog();
            });

            cancelBtn?.addEventListener('click', closeDialog);
            overlay.addEventListener('click', closeDialog);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--foreground)',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '4px'
          }}
        >
          ⚙️
        </button>
      </div>

      {/* 当前文章信息 */}
      {currentArticle && (
        <div style={{
          padding: '8px 16px',
          borderBottom: '1px solid var(--sideBar-border)',
          fontSize: '12px',
          flexShrink: 0
        }}>
          <div style={{ fontWeight: '500', marginBottom: '4px' }}>当前文章</div>
          <div style={{ 
            color: 'var(--descriptionForeground)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {currentArticle.title}
          </div>
        </div>
      )}

      {/* AI操作按钮 */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flexShrink: 0
      }}>
        {aiActions.map(action => (
          <button
            key={action.id}
            onClick={() => handleAiAction(action.id)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '6px 10px',
              backgroundColor: 'var(--button-background)',
              color: 'var(--button-foreground)',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: isLoading ? 0.6 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
        
        {/* 测试滚动条按钮 */}
        <button
          onClick={() => {
            const testMessages: Message[] = [];
            for (let i = 1; i <= 20; i++) {
              testMessages.push({
                id: `test-${i}`,
                sender: 'assistant' as const,
                content: `这是第 ${i} 条测试消息，用于测试滚动条功能。这条消息包含足够的内容来确保滚动条能够正常显示和工作。`,
                timestamp: new Date()
              });
            }
            setMessages(prev => [...prev, ...testMessages]);
          }}
          style={{
            width: '100%',
            padding: '6px 10px',
            backgroundColor: 'var(--button-secondaryBackground)',
            color: 'var(--button-secondaryForeground)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            marginTop: '8px'
          }}
        >
          🧪 测试滚动条
        </button>
        
        {/* 清除加载状态按钮 */}
        <button
          onClick={() => {
            setIsLoading(false);
            setMessages(prev => {
              // 移除所有加载状态的消息
              return prev.filter(msg => !msg.isLoading);
            });
          }}
          style={{
            width: '100%',
            padding: '6px 10px',
            backgroundColor: 'var(--errorForeground)',
            color: 'var(--errorBackground)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            marginTop: '4px'
          }}
        >
          🚫 清除加载状态
        </button>
        
        {/* Ollama API 测试按钮 */}
        <button
          onClick={async () => {
            setIsLoading(true);
            const baseUrl = localStorage.getItem('ai-assistant-ollama-url') || 'http://localhost:11434';
            const model = localStorage.getItem('ai-assistant-ollama-model') || 'qwen2.5:latest';
            
            try {
              // 添加测试开始消息
              const testStartMessage: Message = {
                id: Date.now().toString(),
                sender: 'assistant',
                content: '🧪 开始测试 Ollama API...',
                timestamp: new Date()
              };
              setMessages(prev => [...prev, testStartMessage]);
              
              // 运行API测试
              const result = await testOllamaAPI(baseUrl, model);
              
              // 添加测试结果消息
              const testResultMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'assistant',
                content: `📊 API测试结果:\n\n${result.summary}\n\n连接测试: ${result.connection.message}\n模型测试: ${result.model.message}\n生成测试: ${result.generation.message}`,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, testResultMessage]);
              
              // 运行性能测试
              const perfResult = await testOllamaPerformance(baseUrl, model, 2);
              
              // 添加性能测试结果
              const perfResultMessage: Message = {
                id: (Date.now() + 2).toString(),
                sender: 'assistant',
                content: `⚡ 性能测试结果:\n平均响应时间: ${perfResult.averageTime.toFixed(0)}ms\n最快: ${Math.min(...perfResult.results.map(r => r.time || 0))}ms\n最慢: ${Math.max(...perfResult.results.map(r => r.time || 0))}ms`,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, perfResultMessage]);
              
            } catch (error) {
              const errorMessage: Message = {
                id: Date.now().toString(),
                sender: 'assistant',
                content: `❌ 测试失败: ${error instanceof Error ? error.message : '未知错误'}`,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, errorMessage]);
            } finally {
              setIsLoading(false);
            }
          }}
          style={{
            width: '100%',
            padding: '6px 10px',
            backgroundColor: 'var(--button-background)',
            color: 'var(--button-foreground)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            marginTop: '4px'
          }}
        >
          🔧 测试 Ollama API
        </button>
      </div>

      {/* 聊天区域 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderTop: '1px solid var(--sideBar-border)',
        overflow: 'hidden'
      }}>
        {/* 聊天标题 */}
        <div style={{
          padding: '8px 16px',
          fontSize: '12px',
          fontWeight: '500',
          borderBottom: '1px solid var(--sideBar-border)',
          flexShrink: 0
        }}>
          💬 对话
        </div>

        {/* 消息列表 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          // 自定义滚动条样式
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--scrollbarSlider-activeBackground) var(--scrollbarSlider-background)'
        }}>
          {messages.map(message => (
            <div
              key={message.id}
              data-message-type={message.isLoading ? 'loading' : message.sender}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                lineHeight: '1.4',
                maxWidth: '100%',
                wordWrap: 'break-word',
                backgroundColor: message.sender === 'user' 
                  ? 'var(--button-background)' 
                  : 'var(--list-hoverBackground)',
                color: message.sender === 'user' 
                  ? 'var(--button-foreground)' 
                  : 'var(--foreground)',
                marginLeft: message.sender === 'user' ? '20px' : '0',
                marginRight: message.sender === 'assistant' ? '20px' : '0',
                opacity: message.isLoading ? 0.7 : 1
              }}
            >
              <div style={{ 
                fontWeight: '500', 
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {message.sender === 'user' ? '👤' : '🤖'}
                {message.sender === 'user' ? '我' : 'AI助手'}
                {message.isLoading && (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                )}
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--sideBar-border)',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
          flexShrink: 0
        }}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入问题..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid var(--input-border)',
              borderRadius: '4px',
              backgroundColor: 'var(--input-background)',
              color: 'var(--input-foreground)',
              fontSize: '12px',
              outline: 'none',
              opacity: isLoading ? 0.6 : 1
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--button-background)',
              color: 'var(--button-foreground)',
              border: 'none',
              borderRadius: '4px',
              cursor: (!inputValue.trim() || isLoading) ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              opacity: (!inputValue.trim() || isLoading) ? 0.6 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            发送
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* 自定义滚动条样式 */
        .ai-chat-component ::-webkit-scrollbar {
          width: 8px;
        }
        
        .ai-chat-component ::-webkit-scrollbar-track {
          background: var(--scrollbarSlider-background, #2d2d30);
          border-radius: 4px;
        }
        
        .ai-chat-component ::-webkit-scrollbar-thumb {
          background: var(--scrollbarSlider-activeBackground, #606060);
          border-radius: 4px;
        }
        
        .ai-chat-component ::-webkit-scrollbar-thumb:hover {
          background: var(--scrollbarSlider-hoverBackground, #808080);
        }
        
        /* Firefox 滚动条样式 */
        .ai-chat-component {
          scrollbar-width: thin;
          scrollbar-color: var(--scrollbarSlider-activeBackground, #606060) var(--scrollbarSlider-background, #2d2d30);
        }
      `}</style>
    </div>
  );
};

export default AiChatComponent;
