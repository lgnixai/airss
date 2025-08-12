import { IPluginAPI, IPluginClass } from '../../core/pluginSystem/types';
import React from 'react'; // Added for React.createElement

export class RssPlugin implements IPluginClass {
  private api: IPluginAPI | null = null;

  async onload(api: IPluginAPI) {
    this.api = api;
    
    console.log('RSS Plugin loaded successfully!');
    
    // 初始化 RSS 数据
    this.initializeRssData();
    
    // 等待 Molecule 完全加载后添加活动栏图标
    setTimeout(() => {
      this.addRssActivityBarItem();
    }, 2000);
  }

  private rssFeeds = [
    {
      id: 'techcrunch',
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      icon: '📱',
      description: '科技新闻和创业资讯'
    },
    {
      id: 'hackernews',
      name: 'Hacker News',
      url: 'https://news.ycombinator.com/rss',
      icon: '💻',
      description: '程序员社区热门话题'
    },
    {
      id: 'github',
      name: 'GitHub Trending',
      url: 'https://github.com/trending.atom',
      icon: '🐙',
      description: 'GitHub 热门项目'
    }
  ];

  private feedItems: { [feedId: string]: any[] } = {};

  private initializeRssData() {
    // 初始化模拟数据
    this.feedItems = {
      techcrunch: [
        {
          id: 'tc1',
          title: 'AI 技术突破：新的语言模型性能提升 50%',
          link: 'https://techcrunch.com/ai-breakthrough',
          description: '最新的人工智能研究显示，新的语言模型在多个基准测试中性能提升了 50%...',
          pubDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          feedId: 'techcrunch'
        },
        {
          id: 'tc2',
          title: '电动汽车市场增长超预期',
          link: 'https://techcrunch.com/ev-market-growth',
          description: '全球电动汽车销量在今年第一季度增长了 35%，超出分析师预期...',
          pubDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          feedId: 'techcrunch'
        }
      ],
      hackernews: [
        {
          id: 'hn1',
          title: 'Rust 语言在系统编程中的优势',
          link: 'https://news.ycombinator.com/rust-systems',
          description: 'Rust 语言通过内存安全保证，在系统编程领域展现出独特优势...',
          pubDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          feedId: 'hackernews'
        },
        {
          id: 'hn2',
          title: 'WebAssembly 的未来发展',
          link: 'https://news.ycombinator.com/wasm-future',
          description: 'WebAssembly 技术正在改变 Web 应用的开发方式...',
          pubDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          feedId: 'hackernews'
        }
      ],
      github: [
        {
          id: 'gh1',
          title: 'awesome-react: React 资源集合',
          link: 'https://github.com/enaqx/awesome-react',
          description: '一个精心策划的 React 资源列表，包含教程、组件库、工具等...',
          pubDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          feedId: 'github'
        },
        {
          id: 'gh2',
          title: 'typescript-cheatsheet: TypeScript 速查表',
          link: 'https://github.com/typescript-cheatsheets/react',
          description: 'React 开发者的 TypeScript 速查表，包含常用模式和最佳实践...',
          pubDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          feedId: 'github'
        }
      ]
    };
  }

  private addRssActivityBarItem() {
    console.log('RSS Plugin: Starting to add activity bar item');
    console.log('RSS Plugin: API available:', !!this.api);
    console.log('RSS Plugin: UI API available:', !!this.api?.ui);
    console.log('RSS Plugin: addActivityBarItem available:', !!this.api?.ui?.addActivityBarItem);
    
    // 使用 Molecule API 添加 ActivityBar 图标
    if (this.api && this.api.ui && this.api.ui.addActivityBarItem) {
      try {
        console.log('RSS Plugin: Using Molecule API to add activity bar item');
        this.api.ui.addActivityBarItem({
          id: 'rss-plugin',
          name: 'RSS 阅读器',
          icon: 'rss', // 使用 Molecule 支持的图标名称
          sortIndex: 1, // 在第一个位置
          alignment: 'top', // 添加到顶部区域
          onClick: () => {
            console.log('RSS Plugin: Activity bar item clicked');
            this.showRssSidebar();
          }
        });
        console.log('RSS Plugin: Activity bar item added via Molecule API');
        
        // 监听 Molecule 的 ActivityBar 点击事件
        if (this.api.molecule && this.api.molecule.activityBar) {
          this.api.molecule.activityBar.onClick((item: any) => {
            console.log('RSS Plugin: ActivityBar click event received:', item);
            if (item && item.id === 'rss-plugin') {
              console.log('RSS Plugin: RSS item clicked, showing sidebar');
              this.showRssSidebar();
            }
          });
        }
      } catch (error) {
        console.error('RSS Plugin: Failed to add activity bar item via API:', error);
        // 回退到 DOM 操作
        this.addRssActivityBarItemViaDOM();
      }
    } else {
      console.log('RSS Plugin: Molecule UI API not available, using DOM fallback');
      this.addRssActivityBarItemViaDOM();
    }
  }

  private addRssActivityBarItemViaDOM() {
    // 查找活动栏并添加 RSS 图标
    const activityBar = document.querySelector('[data-testid="activityBar"]') || 
                       document.querySelector('.activityBar') ||
                       document.querySelector('[class*="activity"]') ||
                       document.querySelector('[class*="ActivityBar"]') ||
                       document.querySelector('[class*="activityBar"]') ||
                       document.querySelector('.mo-activityBar__container');
    
    if (activityBar) {
      console.log('RSS Plugin: Found activity bar:', activityBar);
      
      const rssIcon = document.createElement('div');
      rssIcon.innerHTML = '📡';
      rssIcon.title = 'RSS 阅读器';
      rssIcon.style.cssText = `
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
      
      rssIcon.onmouseover = () => {
        rssIcon.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      };
      
      rssIcon.onmouseout = () => {
        rssIcon.style.backgroundColor = 'transparent';
      };
      
      rssIcon.onclick = () => {
        console.log('RSS Plugin: RSS icon clicked via DOM');
        this.showRssSidebar();
      };
      
      // 插入到第一个位置
      const firstItem = activityBar.querySelector('[class*="item"], [class*="icon"]');
      if (firstItem) {
        activityBar.insertBefore(rssIcon, firstItem);
      } else {
        activityBar.appendChild(rssIcon);
      }
      
      console.log('RSS Plugin: RSS activity bar item added at position 1 via DOM');
    } else {
      console.log('RSS Plugin: Activity bar not found, retrying...');
      setTimeout(() => this.addRssActivityBarItemViaDOM(), 1000);
    }
  }

  async onunload() {
    console.log('RSS Plugin unloaded');
  }

  private showRssSidebar() {
    console.log('RSS Plugin: showRssSidebar called');
    
    // 直接使用 Molecule 的 Sidebar API
    if (this.api && this.api.molecule && this.api.molecule.sidebar) {
      try {
        console.log('RSS Plugin: Using Molecule sidebar API directly');
        this.api.molecule.sidebar.add({
          id: 'rss-sidebar',
          name: 'RSS 阅读器',
          render: () => {
            console.log('RSS Plugin: Rendering RSS sidebar content');
            // 创建包含实际 RSS 内容的 React 元素
            const content = React.createElement('div', {
              style: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#252526',
                color: '#cccccc'
              }
            }, [
              // 标题栏
              React.createElement('div', {
                key: 'header',
                style: {
                  padding: '12px 16px',
                  borderBottom: '1px solid #3c3c3c',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }
              }, '📡 RSS 订阅源'),
              
              // 订阅源列表
              React.createElement('div', {
                key: 'feeds',
                style: {
                  flex: 1,
                  overflowY: 'auto',
                  padding: '8px 0'
                }
              }, this.rssFeeds.map(feed => 
                React.createElement('div', {
                  key: feed.id,
                  style: {
                    padding: '8px 16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    borderBottom: '1px solid #3c3c3c'
                  },
                  onMouseOver: (e: any) => {
                    e.target.style.backgroundColor = '#2a2d2e';
                  },
                  onMouseOut: (e: any) => {
                    e.target.style.backgroundColor = 'transparent';
                  },
                  onClick: () => {
                    this.showFeedItemsInSidebar(feed);
                  }
                }, [
                  React.createElement('div', {
                    key: 'content',
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }
                  }, [
                    React.createElement('span', {
                      key: 'icon',
                      style: { fontSize: '16px' }
                    }, feed.icon),
                    React.createElement('div', {
                      key: 'info',
                      style: { flex: 1 }
                    }, [
                      React.createElement('div', {
                        key: 'name',
                        style: {
                          fontWeight: '500',
                          marginBottom: '2px'
                        }
                      }, feed.name),
                      React.createElement('div', {
                        key: 'desc',
                        style: {
                          fontSize: '12px',
                          color: '#cccccc80'
                        }
                      }, feed.description)
                    ])
                  ])
                ])
              ))
            ]);
            console.log('RSS Plugin: RSS sidebar content created successfully');
            return content;
          }
        });
        console.log('RSS Plugin: Sidebar added via Molecule API directly');
        
        // 设置 RSS Sidebar 为当前活动的
        this.api.molecule.sidebar.setCurrent('rss-sidebar');
        console.log('RSS Plugin: Set RSS sidebar as current');
      } catch (error) {
        console.error('RSS Plugin: Failed to add sidebar via Molecule API:', error);
        this.showRssSidebarViaDOM();
      }
    } else {
      console.log('RSS Plugin: Molecule sidebar API not available, using DOM fallback');
      console.log('RSS Plugin: API available:', !!this.api);
      console.log('RSS Plugin: Molecule available:', !!this.api?.molecule);
      console.log('RSS Plugin: Sidebar available:', !!this.api?.molecule?.sidebar);
      this.showRssSidebarViaDOM();
    }
  }

  private showRssSidebarViaDOM() {
    // 创建 RSS 侧边栏内容
    const sidebarContent = this.createRssSidebar();
    
    // 查找侧边栏容器
    const sidebar = document.querySelector('[data-testid="sidebar"]') || 
                   document.querySelector('.sidebar') ||
                   document.querySelector('[class*="sidebar"]') ||
                   document.querySelector('.mo-sidebar__content');
    
    if (sidebar) {
      // 清空侧边栏并添加 RSS 内容
      sidebar.innerHTML = '';
      sidebar.appendChild(sidebarContent);
      console.log('RSS Plugin: RSS sidebar displayed via DOM');
    } else {
      console.log('RSS Plugin: Sidebar not found');
    }
  }

  private createRssSidebar() {
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
      font-weight: bold;
      font-size: 14px;
    `;
    header.innerHTML = '📡 RSS 订阅源';
    container.appendChild(header);

    // 订阅源列表
    const feedsContainer = document.createElement('div');
    feedsContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    `;

    this.rssFeeds.forEach(feed => {
      const feedElement = this.createFeedElement(feed);
      feedsContainer.appendChild(feedElement);
    });

    container.appendChild(feedsContainer);
    return container;
  }

  private createFeedElement(feed: any) {
    const feedDiv = document.createElement('div');
    feedDiv.style.cssText = `
      padding: 8px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
      border-bottom: 1px solid var(--vscode-sideBar-border, #3c3c3c);
    `;

    feedDiv.onmouseover = () => {
      feedDiv.style.backgroundColor = 'var(--vscode-list-hoverBackground, #2a2d2e)';
    };

    feedDiv.onmouseout = () => {
      feedDiv.style.backgroundColor = 'transparent';
    };

    feedDiv.onclick = () => {
      this.showFeedItems(feed);
    };

    feedDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">${feed.icon}</span>
        <div style="flex: 1;">
          <div style="font-weight: 500; margin-bottom: 2px;">${feed.name}</div>
          <div style="font-size: 12px; color: var(--vscode-descriptionForeground, #cccccc80);">
            ${feed.description}
          </div>
        </div>
      </div>
    `;

    return feedDiv;
  }

  private showFeedItemsInSidebar(feed: any) {
    const items = this.feedItems[feed.id] || [];
    
    // 使用 Molecule API 更新侧边栏内容
    if (this.api && this.api.molecule && this.api.molecule.sidebar) {
      try {
        this.api.molecule.sidebar.add({
          id: 'rss-feed-items',
          name: feed.name,
          render: () => {
            return React.createElement('div', {
              style: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#252526',
                color: '#cccccc'
              }
            }, [
              // 标题栏
              React.createElement('div', {
                key: 'header',
                style: {
                  padding: '12px 16px',
                  borderBottom: '1px solid #3c3c3c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }
              }, [
                React.createElement('span', {
                  key: 'icon',
                  style: { fontSize: '16px' }
                }, feed.icon),
                React.createElement('span', {
                  key: 'name',
                  style: {
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }
                }, feed.name),
                React.createElement('button', {
                  key: 'back',
                  style: {
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    color: '#cccccc',
                    cursor: 'pointer',
                    padding: '4px 8px'
                  },
                  onClick: () => {
                    this.showRssSidebar();
                  }
                }, '← 返回')
              ]),
              
              // 文章列表
              React.createElement('div', {
                key: 'items',
                style: {
                  flex: 1,
                  overflowY: 'auto',
                  padding: '8px 0'
                }
              }, items.map(item => 
                React.createElement('div', {
                  key: item.id,
                  style: {
                    padding: '12px 16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    borderBottom: '1px solid #3c3c3c'
                  },
                  onMouseOver: (e: any) => {
                    e.target.style.backgroundColor = '#2a2d2e';
                  },
                  onMouseOut: (e: any) => {
                    e.target.style.backgroundColor = 'transparent';
                  },
                  onClick: () => {
                    this.openArticleInEditor(item);
                  }
                }, [
                  React.createElement('div', {
                    key: 'content',
                    style: { marginBottom: '8px' }
                  }, [
                    React.createElement('div', {
                      key: 'title',
                      style: {
                        fontWeight: '500',
                        lineHeight: '1.4',
                        marginBottom: '4px'
                      }
                    }, item.title),
                    React.createElement('div', {
                      key: 'desc',
                      style: {
                        fontSize: '12px',
                        color: '#cccccc80',
                        lineHeight: '1.3'
                      }
                    }, item.description)
                  ]),
                  React.createElement('div', {
                    key: 'date',
                    style: {
                      fontSize: '11px',
                      color: '#cccccc60'
                    }
                  }, new Date(item.pubDate).toLocaleString('zh-CN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }))
                ])
              ))
            ]);
          }
        });
        
        this.api.molecule.sidebar.setCurrent('rss-feed-items');
      } catch (error) {
        console.error('Failed to show feed items in sidebar:', error);
        this.showFeedItems(feed); // 回退到 DOM 方法
      }
    } else {
      this.showFeedItems(feed); // 回退到 DOM 方法
    }
  }

  private showFeedItems(feed: any) {
    const items = this.feedItems[feed.id] || [];
    
    // 创建文章列表容器
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
      gap: 8px;
    `;
    header.innerHTML = `
      <span style="font-size: 16px;">${feed.icon}</span>
      <span style="font-weight: bold; font-size: 14px;">${feed.name}</span>
      <button onclick="this.goBack()" style="
        margin-left: auto;
        background: none;
        border: none;
        color: var(--vscode-foreground, #cccccc);
        cursor: pointer;
        padding: 4px 8px;
      ">← 返回</button>
    `;
    container.appendChild(header);

    // 文章列表
    const itemsContainer = document.createElement('div');
    itemsContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    `;

    items.forEach(item => {
      const itemElement = this.createArticleElement(item);
      itemsContainer.appendChild(itemElement);
    });

    container.appendChild(itemsContainer);

    // 绑定返回按钮事件
    (window as any).goBack = () => {
      this.showRssSidebar();
    };

    // 更新侧边栏
    const sidebar = document.querySelector('[data-testid="sidebar"]') || 
                   document.querySelector('.sidebar') ||
                   document.querySelector('[class*="sidebar"]');
    
    if (sidebar) {
      sidebar.innerHTML = '';
      sidebar.appendChild(container);
    }
  }

  private createArticleElement(article: any) {
    const articleDiv = document.createElement('div');
    articleDiv.style.cssText = `
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
      border-bottom: 1px solid var(--vscode-sideBar-border, #3c3c3c);
    `;

    articleDiv.onmouseover = () => {
      articleDiv.style.backgroundColor = 'var(--vscode-list-hoverBackground, #2a2d2e)';
    };

    articleDiv.onmouseout = () => {
      articleDiv.style.backgroundColor = 'transparent';
    };

    articleDiv.onclick = () => {
      this.openArticleInEditor(article);
    };

    const pubDate = new Date(article.pubDate).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    articleDiv.innerHTML = `
      <div style="margin-bottom: 8px;">
        <div style="font-weight: 500; line-height: 1.4; margin-bottom: 4px;">
          ${article.title}
        </div>
        <div style="font-size: 12px; color: var(--vscode-descriptionForeground, #cccccc80); line-height: 1.3;">
          ${article.description}
        </div>
      </div>
      <div style="font-size: 11px; color: var(--vscode-descriptionForeground, #cccccc60);">
        ${pubDate}
      </div>
    `;

    return articleDiv;
  }

  private openArticleInEditor(article: any) {
    // 创建文章内容
    const content = `# ${article.title}

**发布时间**: ${new Date(article.pubDate).toLocaleString('zh-CN')}
**来源**: ${this.rssFeeds.find(f => f.id === article.feedId)?.name}
**链接**: [查看原文](${article.link})

---

${article.description}

## 完整内容

这里是文章的完整内容。在实际应用中，这里会显示从 RSS 源获取的完整文章内容。

### 主要观点

- 这是一个示例文章
- 展示了 RSS 阅读器的功能
- 支持在编辑器中查看内容

### 相关链接

- [原文链接](${article.link})
- [更多相关文章](#)

---

*本文通过 RSS 阅读器插件自动获取*
`;

    const tabId = `rss-${article.id}`;
    const tabName = `${article.title}.md`;

    // 检查是否已经存在相同标题的标签页
    if (this.api && this.api.molecule && this.api.molecule.editor) {
      try {
        // 检查标签页是否已存在
        const editorState = this.api.molecule.editor.getState();
        const existingTab = editorState.groups?.flatMap((group: any) => group.data || [])
          .find((tab: any) => tab.id === tabId);
        
        if (existingTab) {
          console.log('Article tab already exists, switching to it:', article.title);
          
          // 找到包含该标签页的组
          const group = editorState.groups?.find((group: any) => 
            group.data?.some((tab: any) => tab.id === tabId)
          );
          
          if (group) {
            // 如果标签页已存在，切换到该标签页
            this.api.molecule.editor.setCurrent(tabId, group.id);
            
            // 通知 AI 助手更新当前文章
            console.log('Emitting ai:updateArticle event with article:', article);
            this.api.events.emit('ai:updateArticle', article);
            
            return;
          }
        }
        
        console.log('Opening article directly in Molecule editor:', article.title);
        
        // 直接使用 Molecule 编辑器 API 打开文章
        this.api.molecule.editor.open({
          id: tabId,
          name: tabName,
          value: content,
          language: 'markdown',
          icon: 'file'
        });

        // 通知 AI 助手更新当前文章
        console.log('Emitting ai:updateArticle event with article:', article);
        this.api.events.emit('ai:updateArticle', article);
        
        console.log('Article opened successfully in editor:', article.title);
      } catch (error) {
        console.error('Failed to open article in editor:', error);
        
        // 回退到事件系统
        try {
          const eventData = {
            id: tabId,
            name: tabName,
            content: content,
            language: 'markdown',
            article: article
          };
          
          console.log('Falling back to event system, emitting rss:openArticle event');
          this.api.events.emit('rss:openArticle', eventData);
        } catch (eventError) {
          console.error('Failed to emit event as well:', eventError);
        }
      }
    } else if (this.api) {
      console.log('Molecule editor API not available, using event system');
      // 回退到事件系统
      try {
        const eventData = {
          id: tabId,
          name: tabName,
          content: content,
          language: 'markdown',
          article: article
        };
        
        console.log('Emitting rss:openArticle event with data:', eventData);
        this.api.events.emit('rss:openArticle', eventData);
      } catch (error) {
        console.error('Failed to emit event:', error);
      }
    } else {
      console.error('No API available to open article');
    }
  }

  private createRssPanel() {
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="padding: 20px;">
        <h3>📡 RSS 阅读器</h3>
        <p>这是一个简单的 RSS 插件示例</p>
        
        <div style="margin: 20px 0;">
          <input 
            type="text" 
            id="rss-url" 
            placeholder="输入 RSS 地址" 
            style="width: 300px; padding: 8px; margin-right: 10px;"
            value="https://rss.cnn.com/rss/edition.rss"
          />
          <button onclick="this.loadRss()" style="padding: 8px 16px;">加载</button>
        </div>
        
        <div id="rss-content" style="border: 1px solid #ccc; padding: 15px; min-height: 200px;">
          <p>点击"加载"按钮来获取 RSS 内容</p>
        </div>
        
        <div style="margin-top: 20px;">
          <button onclick="this.addSampleFeeds()" style="padding: 8px 16px; margin-right: 10px;">
            添加示例源
          </button>
          <button onclick="this.clearFeeds()" style="padding: 8px 16px;">
            清空
          </button>
        </div>
      </div>
    `;

    // 绑定事件处理函数
    (window as any).loadRss = () => this.loadRss();
    (window as any).addSampleFeeds = () => this.addSampleFeeds();
    (window as any).clearFeeds = () => this.clearFeeds();

    return div;
  }

  private async loadRss() {
    const urlInput = document.getElementById('rss-url') as HTMLInputElement;
    const contentDiv = document.getElementById('rss-content');
    
    if (!urlInput || !contentDiv) return;
    
    const url = urlInput.value.trim();
    if (!url) {
      contentDiv.innerHTML = '<p style="color: red;">请输入 RSS 地址</p>';
      return;
    }

    contentDiv.innerHTML = '<p>正在加载 RSS 内容...</p>';

    try {
      // 简单的 RSS 获取（实际项目中应该使用 CORS 代理或后端 API）
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        this.displayRssContent(data.items);
      } else {
        contentDiv.innerHTML = '<p style="color: red;">无法加载 RSS 内容</p>';
      }
    } catch (error) {
      contentDiv.innerHTML = `
        <p style="color: red;">加载失败: ${error}</p>
        <p>注意：由于 CORS 限制，这里使用了 RSS2JSON 服务作为示例</p>
      `;
    }
  }

  private displayRssContent(items: any[]) {
    const contentDiv = document.getElementById('rss-content');
    if (!contentDiv) return;

    if (items.length === 0) {
      contentDiv.innerHTML = '<p>没有找到 RSS 内容</p>';
      return;
    }

    const html = items.slice(0, 5).map(item => `
      <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
        <h4 style="margin: 0 0 5px 0;">
          <a href="${item.link}" target="_blank" style="color: #007acc; text-decoration: none;">
            ${item.title}
          </a>
        </h4>
        <p style="margin: 0; color: #666; font-size: 12px;">
          ${new Date(item.pubDate).toLocaleDateString()}
        </p>
        <p style="margin: 5px 0 0 0; color: #333;">
          ${item.description ? item.description.substring(0, 150) + '...' : ''}
        </p>
      </div>
    `).join('');

    contentDiv.innerHTML = html;
  }

  private addSampleFeeds() {
    const urlInput = document.getElementById('rss-url') as HTMLInputElement;
    if (!urlInput) return;

    const sampleFeeds = [
      'https://rss.cnn.com/rss/edition.rss',
      'https://feeds.bbci.co.uk/news/rss.xml',
      'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml'
    ];

    const randomFeed = sampleFeeds[Math.floor(Math.random() * sampleFeeds.length)];
    urlInput.value = randomFeed;
  }

  private clearFeeds() {
    const contentDiv = document.getElementById('rss-content');
    if (contentDiv) {
      contentDiv.innerHTML = '<p>内容已清空</p>';
    }
  }
}