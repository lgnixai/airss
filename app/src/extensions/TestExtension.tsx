import { FileTypes, IContributeType, IExtension, IMoleculeContext } from '@dtinsight/molecule';
import { debounce } from 'lodash-es';

import TestPane from '../components/testPane';
import React from 'react';
import AiChatComponent from '../components/AiChatComponent';
import { getFileContent, getFiles, getWorkspace, searchFileContents } from '../utils';
import grammars from './grammars';
import { PluginSystemService } from '../core/PluginSystemService';
import PluginManager from '../components/PluginManager';

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
        let pluginSystem: PluginSystemService | null = null;

        // 默认显示 AuxiliaryBar
        molecule.layout.setAuxiliaryBar(true);

        // 添加 AI 助手到 AuxiliaryBar
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
                
                // 设置为当前激活的 AuxiliaryBar
                molecule.auxiliaryBar.setCurrent('ai-assistant');
                

                
                console.log('AI Assistant added to auxiliary bar via Molecule API');
            } catch (error) {
                console.error('Failed to add AI Assistant via Molecule API:', error);
            }
        }, 2000);

        // AI 助手功能函数
        let currentArticle: any = null;
        let currentTabContent: string = '';



        // 处理AI操作
        function handleAiAction(actionId: string) {
            // 实时获取当前编辑器内容
            let content = '';
            
            try {
                // 尝试从当前活动的编辑器获取内容
                const currentGroup = molecule.editor.getCurrentGroup();
                if (currentGroup && currentGroup.editorInstance) {
                    const model = currentGroup.editorInstance.getModel();
                    if (model) {
                        content = model.getValue();
                    }
                }
            } catch (error) {
                console.log('无法从编辑器获取内容，使用缓存内容');
            }
            
            // 如果编辑器没有内容，使用缓存的内容
            if (!content) {
                content = currentTabContent;
            }
            
            // 如果还是没有内容，使用当前文章内容
            if (!content && currentArticle) {
                // 如果当前文章存在，构建文章内容
                content = `# ${currentArticle.title}

**发布时间**: ${currentArticle.pubDate ? new Date(currentArticle.pubDate).toLocaleString('zh-CN') : '未知'}
**来源**: ${currentArticle.feedId || 'RSS'}
**链接**: ${currentArticle.link || '无'}

---

${currentArticle.description || currentArticle.content || ''}

## 完整内容

${currentArticle.content || '这里是文章的完整内容。'}`;
            }
            
            if (!content) {
                // 新组件会自己处理消息显示
                return;
            }

            // 新组件会自己处理加载状态

            if (actionId === 'chat') {
                startChatMode();
                return;
            }

            const actions = {
                summarize: () => callOllamaAPI('summarize', content),
                translate: () => callOllamaAPI('translate', content),
                explain: () => callOllamaAPI('explain', content),
                'code-review': () => callOllamaAPI('code-review', content),
                optimize: () => callOllamaAPI('optimize', content),
                'generate-code': () => callOllamaAPI('generate-code', content)
            };

            const action = actions[actionId as keyof typeof actions];
            if (action) {
                action().then((result: any) => {
                    // 通过自定义事件通知AI组件更新消息
                    window.dispatchEvent(new CustomEvent('ai:updateMessage', {
                        detail: {
                            type: 'success',
                            content: result
                        }
                    }));
                }).catch((error: any) => {
                    // 通过自定义事件通知AI组件更新错误消息
                    window.dispatchEvent(new CustomEvent('ai:updateMessage', {
                        detail: {
                            type: 'error',
                            content: '抱歉，处理失败，请检查Ollama服务是否运行。'
                        }
                    }));
                });
            }
        }

        // 发送聊天消息 - 新组件会自己处理
        function sendChatMessage() {
            // 新组件会自己处理消息发送
        }

        // 处理聊天消息
        function handleChatMessage(message: string) {
            // 实时获取当前编辑器内容作为上下文
            let context = '';
            try {
                const currentGroup = molecule.editor.getCurrentGroup();
                if (currentGroup && currentGroup.editorInstance) {
                    const model = currentGroup.editorInstance.getModel();
                    if (model) {
                        context = model.getValue();
                    }
                }
            } catch (error) {
                console.log('无法从编辑器获取内容，使用缓存内容');
            }
            
            // 如果编辑器没有内容，使用缓存的内容
            if (!context) {
                context = currentTabContent;
            }
            
            // 如果还是没有内容，使用当前文章内容
            if (!context && currentArticle) {
                context = currentArticle.content || '';
            }
            
            const fullPrompt = context ? 
                `你是一个专业的智能助手，具备丰富的知识和经验。

## 当前上下文：
${context}

## 用户问题：
${message}

## 回答要求：
1. 基于提供的上下文内容回答问题
2. 如果问题与上下文无关，请基于你的知识直接回答
3. 提供准确、有用、详细的回答
4. 使用清晰的结构和分点说明
5. 用中文回答，语言专业且易懂
6. 如果适用，提供具体的例子和建议

请开始回答：` :
                `你是一个专业的智能助手，具备丰富的知识和经验。

## 用户问题：
${message}

## 回答要求：
1. 提供准确、有用、详细的回答
2. 使用清晰的结构和分点说明
3. 用中文回答，语言专业且易懂
4. 如果适用，提供具体的例子和建议
5. 保持客观中立的语调

请开始回答：`;
            
            callOllamaAPI('chat', fullPrompt).then(result => {
                // 通过自定义事件通知AI组件更新消息
                window.dispatchEvent(new CustomEvent('ai:updateMessage', {
                    detail: {
                        type: 'success',
                        content: result
                    }
                }));
            }).catch(error => {
                // 通过自定义事件通知AI组件更新错误消息
                window.dispatchEvent(new CustomEvent('ai:updateMessage', {
                    detail: {
                        type: 'error',
                        content: '抱歉，我无法回答这个问题。'
                    }
                }));
            });
        }

        // 开始聊天模式
        function startChatMode() {
            // 新组件会自己处理聊天模式
        }

        // 调用Ollama API
        async function callOllamaAPI(action: string, content: string) {
            const baseUrl = localStorage.getItem('ai-assistant-ollama-url') || 'http://localhost:11434';
            const model = localStorage.getItem('ai-assistant-ollama-model') || 'qwen2.5:latest';
            
            let prompt = '';
            switch (action) {
                case 'summarize':
                    prompt = `你是一个专业的文章总结助手。请对以下文章进行详细而全面的总结，要求：

## 总结要求：
1. **核心观点提取**：准确识别文章的主要论点和核心思想
2. **关键信息梳理**：提取重要的数据、事实、案例和结论
3. **结构分析**：分析文章的逻辑结构和论证方式
4. **价值评估**：评估文章的价值和意义
5. **实用建议**：如果适用，提供基于文章内容的实用建议

## 输出格式：
- 使用清晰的标题和分点结构
- 用中文回答，语言专业且易懂
- 保持客观中立的语调
- 如果文章较长，请按主题分点总结
- 在最后提供简短的总体评价

## 文章内容：
${content}

请开始总结：`;
                    break;
                case 'translate':
                    prompt = `你是一个专业的翻译助手。请将以下内容翻译成中文，要求：

## 翻译要求：
1. **准确性**：保持原文的准确含义和核心信息
2. **流畅性**：使用自然流畅的中文表达
3. **专业性**：保持专业术语的准确性和一致性
4. **文化适应性**：适当调整表达方式以符合中文阅读习惯
5. **格式保持**：保持原文的段落结构和格式

## 输出格式：
- 提供完整的中文翻译
- 如果原文有标题，请翻译标题
- 保持原文的段落结构
- 对于专业术语，可在必要时提供英文原文

## 原文内容：
${content}

请开始翻译：`;
                    break;
                case 'explain':
                    prompt = `你是一个专业的技术概念解释助手。请解释以下内容中提到的技术概念，要求：

## 解释要求：
1. **概念识别**：准确识别内容中的技术概念和术语
2. **通俗解释**：用通俗易懂的语言解释复杂概念
3. **实例说明**：提供具体的例子、类比和实际应用场景
4. **关系分析**：如果涉及多个概念，说明它们之间的关系和区别
5. **价值阐述**：说明这些概念的重要性和实际意义

## 输出格式：
- 按概念重要性排序解释
- 每个概念包含：定义、特点、应用场景、重要性
- 使用清晰的标题和分点结构
- 提供具体的例子和类比
- 用中文回答，语言简洁明了

## 内容：
${content}

请开始解释：`;
                    break;
                case 'code-review':
                    prompt = `你是一个专业的代码审查专家。请对以下代码进行全面的审查，要求：

## 审查要求：
1. **语法检查**：检查代码的语法错误和潜在问题
2. **逻辑分析**：评估代码的逻辑正确性和健壮性
3. **性能评估**：分析代码的性能瓶颈和优化空间
4. **安全检查**：识别潜在的安全漏洞和风险
5. **最佳实践**：评估代码是否符合行业最佳实践
6. **可维护性**：分析代码的可读性和维护性

## 输出格式：
- 按严重程度分类问题（严重、中等、轻微）
- 每个问题包含：问题描述、影响分析、改进建议
- 提供具体的代码示例和改进方案
- 给出总体评价和改进优先级
- 用中文回答，语言专业且易懂

## 代码内容：
${content}

请开始代码审查：`;
                    break;
                case 'optimize':
                    prompt = `你是一个专业的优化建议专家。请分析以下内容并提供优化建议，要求：

## 优化分析要求：
1. **性能优化**：识别性能瓶颈和优化机会
2. **代码质量**：分析代码的可读性、可维护性和可扩展性
3. **安全性增强**：识别潜在的安全风险和防护措施
4. **用户体验**：从用户角度分析可能的改进点
5. **资源利用**：评估资源使用效率和优化空间

## 输出格式：
- 按优化效果和实施难度分类建议
- 每个建议包含：问题描述、优化方案、预期效果、实施步骤
- 提供具体的实施建议和代码示例
- 给出优化优先级和实施时间估算
- 用中文回答，语言专业且易懂

## 内容：
${content}

请开始优化分析：`;
                    break;
                case 'generate-code':
                    prompt = `你是一个专业的代码生成专家。请根据以下需求生成高质量的代码，要求：

## 代码生成要求：
1. **功能完整**：确保代码能够满足所有需求
2. **代码质量**：遵循最佳实践和编码规范
3. **可读性**：代码结构清晰，注释完整
4. **可维护性**：易于理解和修改
5. **性能考虑**：考虑代码的执行效率

## 输出格式：
- 提供完整的代码实现
- 包含必要的注释和说明
- 如果涉及多个文件，请分别说明
- 提供使用示例和注意事项
- 用中文注释，代码语言根据需求确定

## 需求描述：
${content}

请开始生成代码：`;
                    break;
                case 'chat':
                    prompt = content;
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
            const result = data.response || '抱歉，我无法生成回答。';
            
            // 更新最后一条消息
            const messagesContainer = document.getElementById('ai-messages');
            if (messagesContainer && messagesContainer.lastElementChild) {
                const lastMessage = messagesContainer.lastElementChild as HTMLElement;
                const contentDiv = lastMessage.querySelector('div:last-child');
                if (contentDiv) {
                    contentDiv.textContent = result;
                }
            }
            
            return result;
        }

        // 显示AI设置
        function showAiSettings() {
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

            const saveBtn = settingsDialog.querySelector('#save-settings');
            const cancelBtn = settingsDialog.querySelector('#cancel-settings');

            const closeDialog = () => {
                document.body.removeChild(overlay);
                document.body.removeChild(settingsDialog);
            };

            saveBtn?.addEventListener('click', () => {
                const url = (settingsDialog.querySelector('#ollama-url') as HTMLInputElement)?.value;
                const model = (settingsDialog.querySelector('#ollama-model') as HTMLInputElement)?.value;
                
                localStorage.setItem('ai-assistant-ollama-url', url || 'http://localhost:11434');
                localStorage.setItem('ai-assistant-ollama-model', model || 'qwen2.5:latest');
                
                // 新组件会自己处理设置保存提示
                closeDialog();
            });

            cancelBtn?.addEventListener('click', closeDialog);
            overlay.addEventListener('click', closeDialog);
        }

        // 更新当前文章
        function updateCurrentArticle(article: any) {
            currentArticle = article;
            const titleElement = document.getElementById('current-article-title');
            if (titleElement) {
                titleElement.textContent = article ? article.title : '未选择文章';
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

        // 监听编辑器标签页切换事件
        molecule.editor.onSelectTab((tabId: any, groupId: any) => {
            updateCurrentTabContent(tabId, groupId);
        });

        // 延迟初始化插件系统，确保 Molecule 完全加载
        setTimeout(() => {
            try {
                console.log('Starting plugin system initialization...');
                pluginSystem = new PluginSystemService(molecule);
                pluginSystem.initialize().then(() => {
                    console.log('Plugin system initialized successfully');
                    
                                            // 监听 RSS 插件的编辑器打开事件
                        if (pluginSystem) {
                            const pluginManager = pluginSystem.getPluginManager();
                            pluginManager.on('rss:openArticle', (data: any) => {
                                console.log('Opening RSS article in editor:', data);
                                
                                // 检查标签页是否已存在
                                const editorState = molecule.editor.getState();
                                const existingTab = editorState.groups?.flatMap((group: any) => group.data || [])
                                    .find((tab: any) => tab.id === data.id);
                                
                                if (existingTab) {
                                    console.log('RSS article tab already exists, switching to it:', data.name);
                                    // 找到包含该标签页的组
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
                            // 更新当前文章
                            updateCurrentArticle(article);
                        });
                    }
                    
                }).catch(error => {
                    console.error('Failed to initialize plugin system:', error);
                });
            } catch (error) {
                console.error('Failed to create plugin system:', error);
            }
        }, 2000); // 增加延迟时间

        molecule.activityBar.add({
            id: 'testPane',
            name: 'testPane',
            alignment: 'top',
            sortIndex: 2,
            icon: 'beaker',
        });

        molecule.activityBar.add({
            id: 'pluginManager',
            name: '插件管理',
            alignment: 'top',
            sortIndex: 3,
            icon: 'puzzle',
        });
        molecule.sidebar.add({
            id: 'testPane',
            name: 'testPane',
            render: () => <TestPane context={molecule} />,
        });

        // 延迟注册插件管理组件，确保插件系统已初始化
        setTimeout(() => {
            molecule.sidebar.add({
                id: 'pluginManager',
                name: '插件管理',
                render: () => <PluginManager pluginSystem={pluginSystem} />,
            });
        }, 3000); // 在插件系统初始化后注册

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

        molecule.contextMenu.onClick((item) => {
            if (item.id === 'testPane__activityBar__molecule') {
                alert('Molecule');
            }
        });

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

        molecule.search.onSelect((treeNode) => {
            if (treeNode.fileType === 'File') {
                openFile({ id: treeNode.id, name: treeNode.name });
            }
        });

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

        molecule.folderTree.onContextMenu((_, treeNode) => {
            if (treeNode.fileType === FileTypes.File) {
                molecule.contextMenu.add([
                    { id: 'testPane', name: '打开 testPane 面板' },
                    { id: 'testPane_divider', type: 'divider' },
                ]);
            }
        });

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

        molecule.folderTree.onDrop((source, target) => {
            molecule.folderTree.drop(source.id, target.id);
        });

        molecule.menuBar.onSelect((menuId) => {
            if (menuId === molecule.builtin.getConstants().MENUBAR_ITEM_ABOUT) {
                window.open('https://github.com/DTStack/molecule', '_blank');
            }
        });

        molecule.menuBar.subscribe('APP_DEBUG_ICON', () => {
            const quickPick = monaco.QuickInputService.createQuickPick();
            quickPick.busy = true;
            quickPick.items = [];
            quickPick.show();
        });

        molecule.editor.onClose((tabs) => {
            molecule.notification.open({
                id: `close_tab_${new Date().valueOf()}`,
                value: `关闭了 ${tabs.length} 个 tab`,
            });
        });

        molecule.editor.onCurrentChange((_, next) => {
            if (next.tabId) {
                molecule.folderTree.setCurrent(next.tabId);
            }
        });

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
    },
};
