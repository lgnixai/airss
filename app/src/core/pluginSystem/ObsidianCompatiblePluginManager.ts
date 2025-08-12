import { IPlugin, IPluginManifest, IPluginAPI, PluginStatus } from './types';
import React from 'react';

// 浏览器兼容的事件发射器
class EventEmitter {
  protected events: { [key: string]: Function[] } = {};

  on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listener: Function) {
    if (!this.events[event]) return;
    const index = this.events[event].indexOf(listener);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error('Event listener error:', error);
      }
    });
  }
}

// Obsidian 兼容的组件基类
export abstract class Component extends EventEmitter {
  protected registeredEvents: Array<{ element: Element; type: string; listener: EventListener }> = [];
  protected registeredIntervals: Array<NodeJS.Timeout> = [];

  registerEvent(event: any): void {
    // 注册事件，插件卸载时自动清理
    this.registeredEvents.push(event);
  }

  registerDomEvent(element: Element, type: string, listener: Function): void {
    const eventListener = listener as EventListener;
    element.addEventListener(type, eventListener);
    this.registeredEvents.push({ element, type, listener: eventListener });
  }

  registerInterval(interval: NodeJS.Timeout): void {
    this.registeredIntervals.push(interval);
  }

  dispose(): void {
    // 清理所有注册的事件
    this.registeredEvents.forEach(({ element, type, listener }) => {
      element.removeEventListener(type, listener);
    });
    this.registeredEvents = [];

    // 清理所有定时器
    this.registeredIntervals.forEach(interval => clearInterval(interval));
    this.registeredIntervals = [];

    // 清理事件监听器
    this.events = {};
  }
}

// 扩展 HTMLElement 接口以支持 Obsidian 风格的方法
declare global {
  interface HTMLElement {
    setText(text: string): void;
    empty(): void;
    createDiv(options?: { cls?: string; text?: string }): HTMLDivElement;
    createEl<K extends keyof HTMLElementTagNameMap>(
      tag: K, 
      options?: { cls?: string; text?: string; attr?: Record<string, string>; type?: string }
    ): HTMLElementTagNameMap[K];
    setCssStyles(styles: Partial<CSSStyleDeclaration>): void;
  }
}

// 为 HTMLElement 添加 Obsidian 风格的方法
HTMLElement.prototype.setText = function(text: string) {
  this.textContent = text;
};

HTMLElement.prototype.empty = function() {
  this.innerHTML = '';
};

HTMLElement.prototype.createDiv = function(options?: { cls?: string; text?: string }) {
  const div = document.createElement('div');
  if (options?.cls) {
    div.className = options.cls;
  }
  if (options?.text) {
    div.textContent = options.text;
  }
  this.appendChild(div);
  return div;
};

HTMLElement.prototype.createEl = function<K extends keyof HTMLElementTagNameMap>(
  tag: K, 
  options?: { cls?: string; text?: string; attr?: Record<string, string>; type?: string }
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (options?.cls) {
    element.className = options.cls;
  }
  if (options?.text) {
    element.textContent = options.text;
  }
  if (options?.type) {
    (element as HTMLInputElement).type = options.type;
  }
  if (options?.attr) {
    Object.entries(options.attr).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  this.appendChild(element);
  return element;
};

HTMLElement.prototype.setCssStyles = function(styles: Partial<CSSStyleDeclaration>) {
  Object.assign(this.style, styles);
};

// Obsidian 兼容的插件基类
export abstract class Plugin extends Component {
  public app: App;
  public manifest: IPluginManifest;

  constructor(app: App, manifest: IPluginManifest) {
    super();
    this.app = app;
    this.manifest = manifest;
  }

  abstract onload(): Promise<void> | void;
  onunload?(): Promise<void> | void;

  // Obsidian 兼容的 API 方法
  addRibbonIcon(icon: string, title: string, callback: (evt: MouseEvent) => any): HTMLElement {
    return this.app.ui.addRibbonIcon(icon, title, callback);
  }

  addStatusBarItem(): HTMLElement {
    return this.app.ui.addStatusBarItem();
  }

  addCommand(command: Command): Command {
    return this.app.commands.addCommand(command);
  }

  removeCommand(commandId: string): void {
    this.app.commands.removeCommand(commandId);
  }

  addSettingTab(settingTab: PluginSettingTab): void {
    this.app.settings.addSettingTab(settingTab);
  }

  registerView(type: string, viewCreator: ViewCreator): void {
    this.app.workspace.registerView(type, viewCreator);
  }

  registerMarkdownPostProcessor(postProcessor: MarkdownPostProcessor, sortOrder?: number): MarkdownPostProcessor {
    return this.app.editor.registerMarkdownPostProcessor(postProcessor, sortOrder);
  }

  registerMarkdownCodeBlockProcessor(
    language: string, 
    handler: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<any> | void, 
    sortOrder?: number
  ): MarkdownPostProcessor {
    return this.app.editor.registerMarkdownCodeBlockProcessor(language, handler, sortOrder);
  }

  loadData(): Promise<any> {
    return this.app.storage.loadData(this.manifest.id);
  }

  saveData(data: any): Promise<void> {
    return this.app.storage.saveData(this.manifest.id, data);
  }
}

// Obsidian 兼容的 App 接口
export interface App {
  keymap: Keymap;
  scope: Scope;
  workspace: Workspace;
  vault: Vault;
  metadataCache: MetadataCache;
  fileManager: FileManager;
  ui: UI;
  commands: Commands;
  settings: Settings;
  storage: Storage;
  editor: Editor;
  lastEvent: UserEvent | null;
  loadLocalStorage(key: string): any | null;
  saveLocalStorage(key: string, data: unknown | null): void;
  molecule?: any; // 添加 Molecule 框架支持
}

// 核心服务接口
export interface Vault {
  read(file: TFile): Promise<string>;
  write(file: TFile, data: string): Promise<void>;
  create(path: string, data: string): Promise<TFile>;
  delete(file: TFile): Promise<void>;
  rename(file: TFile, newPath: string): Promise<void>;
  getAbstractFileByPath(path: string): TAbstractFile | null;
  getFiles(): TFile[];
  getMarkdownFiles(): TFile[];
  createFolder(path: string): Promise<TFolder>;
  exists(path: string): boolean;
}

export interface Workspace {
  onLayoutReady(callback: () => void): void;
  onFileOpen(callback: (file: TFile) => void): void;
  onFileClose(callback: (file: TFile) => void): void;
  onActiveLeafChange(callback: (leaf: WorkspaceLeaf) => void): void;
  getActiveFile(): TFile | null;
  getActiveLeaf(): WorkspaceLeaf | null;
  getLeavesOfType(type: string): WorkspaceLeaf[];
  openLinkText(linktext: string, source: string, newLeaf?: boolean): Promise<void>;
  openFile(file: TFile, newLeaf?: boolean): Promise<void>;
  registerView(type: string, viewCreator: ViewCreator): void;
  registerHoverLinkSource(id: string, info: HoverLinkSource): void;
  registerExtensions(extensions: string[], viewType: string): void;
}

export interface MetadataCache {
  getFileCache(file: TFile): CachedMetadata | null;
  getFirstLinkpathDest(linkpath: string, sourcePath: string): TFile | null;
  getBacklinksForFile(file: TFile): Record<string, Reference[]> | null;
  getForwardLinksForFile(file: TFile): Record<string, Reference[]> | null;
  onChanged(callback: (file: TFile, data: string, cache: CachedMetadata) => void): void;
}

export interface FileManager {
  createNewMarkdownFile(folder?: TFolder, filename?: string): Promise<TFile>;
  deleteFile(file: TFile): Promise<void>;
  renameFile(file: TFile, newPath: string): Promise<void>;
  copyFile(file: TFile, newPath: string): Promise<TFile>;
}

export interface UI {
  addRibbonIcon(icon: string, title: string, callback: (evt: MouseEvent) => any): HTMLElement;
  addStatusBarItem(): HTMLElement;
  addSettingTab(tab: PluginSettingTab): void;
}

export interface Commands {
  addCommand(command: Command): Command;
  removeCommand(commandId: string): void;
  executeCommandById(commandId: string): boolean;
}

export interface Settings {
  addSettingTab(tab: PluginSettingTab): void;
  getSetting(key: string): any;
  setSetting(key: string, value: any): void;
}

export interface Storage {
  loadData(pluginId: string): Promise<any>;
  saveData(pluginId: string, data: any): Promise<void>;
}

export interface Editor {
  registerMarkdownPostProcessor(postProcessor: MarkdownPostProcessor, sortOrder?: number): MarkdownPostProcessor;
  registerMarkdownCodeBlockProcessor(
    language: string, 
    handler: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<any> | void, 
    sortOrder?: number
  ): MarkdownPostProcessor;
  registerEditorExtension(extension: any): void;
}

// 类型定义
export interface TFile {
  path: string;
  name: string;
  basename: string;
  extension: string;
  vault: Vault;
  parent: TFolder | null;
  stat: FileStats;
}

export interface TFolder {
  path: string;
  name: string;
  vault: Vault;
  parent: TFolder | null;
  children: TAbstractFile[];
}

export type TAbstractFile = TFile | TFolder;

export interface FileStats {
  ctime: number;
  mtime: number;
  size: number;
}

export interface WorkspaceLeaf {
  id: string;
  view: View;
  getViewState(): any;
  setViewState(state: any): void;
  openFile(file: TFile): Promise<void>;
  detach(): void;
}

export interface View {
  getViewType(): string;
  getDisplayText(): string;
  onload(): void;
  onunload(): void;
}

export interface ViewCreator {
  new(leaf: WorkspaceLeaf): View;
}

export interface Command {
  id: string;
  name: string;
  callback?: () => any;
  hotkeys?: Hotkey[];
  checkCallback?: (checking: boolean) => boolean | void;
}

export interface Hotkey {
  modifiers: string[];
  key: string;
}

export interface PluginSettingTab {
  id: string;
  name: string;
  tab: HTMLElement;
}

export interface MarkdownPostProcessor {
  type: 'markdown';
  sortOrder?: number;
  process(element: HTMLElement, context: MarkdownPostProcessorContext): void;
}

export interface MarkdownPostProcessorContext {
  sourcePath: string;
  frontmatter: any;
  docId: string;
}

export interface HoverLinkSource {
  display: string;
  defaultMod: boolean;
}

export interface CachedMetadata {
  frontmatter?: any;
  headings?: HeadingCache[];
  links?: LinkCache[];
  embeds?: EmbedCache[];
  tags?: TagCache[];
  sections?: SectionCache[];
  listItems?: ListItemCache[];
  blocks?: Record<string, BlockCache>;
}

export interface HeadingCache {
  level: number;
  heading: string;
  position: Position;
}

export interface LinkCache {
  link: string;
  original: string;
  position: Position;
  displayText?: string;
  subpath?: string;
}

export interface EmbedCache {
  link: string;
  original: string;
  position: Position;
  subpath?: string;
}

export interface TagCache {
  tag: string;
  position: Position;
}

export interface SectionCache {
  id: string;
  type: string;
  position: Position;
}

export interface ListItemCache {
  position: Position;
  task?: string;
  listType?: string;
}

export interface BlockCache {
  id: string;
  position: Position;
  type: string;
}

export interface Position {
  start: Loc;
  end: Loc;
}

export interface Loc {
  line: number;
  col: number;
  offset: number;
}

export interface Reference {
  link: string;
  displayText?: string;
  original: string;
  position: Position;
}

export interface UserEvent {
  type: string;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

export interface Keymap {
  getRootScope(): Scope;
}

export interface Scope {
  keys: Record<string, any>;
  parent: Scope | null;
}

// 增强版插件管理器
export class ObsidianCompatiblePluginManager extends EventEmitter {
  private plugins: Map<string, IPlugin> = new Map();
  private pluginAPIs: Map<string, IPluginAPI> = new Map();
  private enabledPlugins: Set<string> = new Set();
  private pluginSettings: Map<string, any> = new Map();
  private moleculeContext: any;
  private app: App;

  constructor(moleculeContext?: any) {
    super();
    this.moleculeContext = moleculeContext;
    this.app = this.createApp();
  }

  /**
   * 创建 Obsidian 兼容的 App 实例
   */
  private createApp(): App {
    return {
      keymap: this.createKeymap(),
      scope: this.createScope(),
      workspace: this.createWorkspace(),
      vault: this.createVault(),
      metadataCache: this.createMetadataCache(),
      fileManager: this.createFileManager(),
      ui: this.createUI(),
      commands: this.createCommands(),
      settings: this.createSettings(),
      storage: this.createStorage(),
      editor: this.createEditor(),
      lastEvent: null,
      loadLocalStorage: (key: string) => this.loadLocalStorage(key),
      saveLocalStorage: (key: string, data: unknown | null) => this.saveLocalStorage(key, data),
      molecule: this.moleculeContext // 添加 Molecule 上下文
    };
  }

  /**
   * 注册 Obsidian 兼容的插件
   */
  async registerObsidianPlugin(manifest: IPluginManifest, PluginClass: new (app: App, manifest: IPluginManifest) => Plugin): Promise<void> {
    const pluginId = manifest.id;
    
    if (this.plugins.has(pluginId)) {
      throw new Error(`Plugin ${pluginId} is already registered`);
    }

    try {
      // 创建插件实例
      const pluginInstance = new PluginClass(this.app, manifest);
      
      const plugin: IPlugin = {
        id: pluginId,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        author: manifest.author,
        dependencies: manifest.dependencies || [],
        status: PluginStatus.REGISTERED,
        manifest,
        instance: pluginInstance,
        api: null
      };

      this.plugins.set(pluginId, plugin);
      this.emit('pluginRegistered', plugin);
      
      console.log(`Obsidian compatible plugin ${pluginId} registered successfully`);
    } catch (error) {
      console.error(`Failed to register plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * 启用 Obsidian 兼容的插件
   */
  async enableObsidianPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`);
    }

    if (this.enabledPlugins.has(pluginId)) {
      return; // 已经启用
    }

    // 检查依赖
    await this.checkDependencies(plugin);

    try {
      const pluginInstance = plugin.instance as Plugin;
      
      // 调用插件的 onload 方法
      if (pluginInstance.onload) {
        await pluginInstance.onload();
      }

      plugin.status = PluginStatus.ENABLED;
      this.enabledPlugins.add(pluginId);
      this.emit('pluginEnabled', plugin);
      
      console.log(`Obsidian compatible plugin ${pluginId} enabled successfully`);
    } catch (error) {
      plugin.status = PluginStatus.ERROR;
      this.emit('pluginError', plugin, error);
      console.error(`Failed to enable plugin ${pluginId}:`, error);
      throw error;
    }
  }

  /**
   * 禁用 Obsidian 兼容的插件
   */
  async disableObsidianPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin || !this.enabledPlugins.has(pluginId)) {
      return;
    }

    try {
      const pluginInstance = plugin.instance as Plugin;
      
      // 调用插件的 onunload 方法
      if (pluginInstance.onunload) {
        await pluginInstance.onunload();
      }

      // 调用 dispose 方法清理资源
      pluginInstance.dispose();

      plugin.status = PluginStatus.REGISTERED;
      this.enabledPlugins.delete(pluginId);
      this.emit('pluginDisabled', plugin);
      
      console.log(`Obsidian compatible plugin ${pluginId} disabled successfully`);
    } catch (error) {
      this.emit('pluginError', plugin, error);
      console.error(`Failed to disable plugin ${pluginId}:`, error);
      throw error;
    }
  }

  // 创建各个服务的实现
  private createKeymap(): Keymap {
    return {
      getRootScope: () => this.createScope()
    };
  }

  private createScope(): Scope {
    return {
      keys: {},
      parent: null
    };
  }

  private createWorkspace(): Workspace {
    return {
      onLayoutReady: (callback: () => void) => {
        // 模拟布局就绪事件
        setTimeout(callback, 100);
      },
      onFileOpen: (callback: (file: TFile) => void) => {
        this.on('file:open', callback);
      },
      onFileClose: (callback: (file: TFile) => void) => {
        this.on('file:close', callback);
      },
      onActiveLeafChange: (callback: (leaf: WorkspaceLeaf) => void) => {
        this.on('leaf:active', callback);
      },
      getActiveFile: () => null,
      getActiveLeaf: () => null,
      getLeavesOfType: (type: string) => [],
      openLinkText: async (linktext: string, source: string, newLeaf?: boolean) => {
        // 实现链接打开逻辑
      },
      openFile: async (file: TFile, newLeaf?: boolean) => {
        // 实现文件打开逻辑
      },
      registerView: (type: string, viewCreator: ViewCreator) => {
        // 实现视图注册逻辑
      },
      registerHoverLinkSource: (id: string, info: HoverLinkSource) => {
        // 实现悬停链接源注册逻辑
      },
      registerExtensions: (extensions: string[], viewType: string) => {
        // 实现扩展注册逻辑
      }
    };
  }

  private createVault(): Vault {
    return {
      read: async (file: TFile) => {
        // 实现文件读取逻辑
        return '';
      },
      write: async (file: TFile, data: string) => {
        // 实现文件写入逻辑
      },
      create: async (path: string, data: string) => {
        // 实现文件创建逻辑
        return {} as TFile;
      },
      delete: async (file: TFile) => {
        // 实现文件删除逻辑
      },
      rename: async (file: TFile, newPath: string) => {
        // 实现文件重命名逻辑
      },
      getAbstractFileByPath: (path: string) => null,
      getFiles: () => [],
      getMarkdownFiles: () => [],
      createFolder: async (path: string) => {
        // 实现文件夹创建逻辑
        return {} as TFolder;
      },
      exists: (path: string) => false
    };
  }

  private createMetadataCache(): MetadataCache {
    return {
      getFileCache: (file: TFile) => null,
      getFirstLinkpathDest: (linkpath: string, sourcePath: string) => null,
      getBacklinksForFile: (file: TFile) => null,
      getForwardLinksForFile: (file: TFile) => null,
      onChanged: (callback: (file: TFile, data: string, cache: CachedMetadata) => void) => {
        this.on('metadata:changed', callback);
      }
    };
  }

  private createFileManager(): FileManager {
    return {
      createNewMarkdownFile: async (folder?: TFolder, filename?: string) => {
        // 实现新文件创建逻辑
        return {} as TFile;
      },
      deleteFile: async (file: TFile) => {
        // 实现文件删除逻辑
      },
      renameFile: async (file: TFile, newPath: string) => {
        // 实现文件重命名逻辑
      },
      copyFile: async (file: TFile, newPath: string) => {
        // 实现文件复制逻辑
        return {} as TFile;
      }
    };
  }

  private createUI(): UI {
    return {
      addRibbonIcon: (icon: string, title: string, callback: (evt: MouseEvent) => any) => {
        // 实现图标添加逻辑 - 使用 Molecule 活动栏 API
        if (this.moleculeContext && this.moleculeContext.activityBar) {
          try {
            // 生成唯一的ID
            const iconId = `obsidian-ribbon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // 添加到 Molecule 活动栏 - 使用正确的API格式
            this.moleculeContext.activityBar.add({
              id: iconId,
              name: title,
              alignment: 'top',
              sortIndex: 10,
              icon: icon,
              onClick: () => {
                console.log(`Hello Plugin: Activity bar item clicked: ${title}`);
                try {
                  callback({} as any);
                } catch (error) {
                  console.error('Error in onClick callback:', error);
                }
              }
            });
            
            // 返回一个模拟的元素用于API兼容性
            const element = document.createElement('div');
            element.innerHTML = icon;
            element.title = title;
            element.id = iconId;
            element.style.display = 'none'; // 隐藏这个元素，因为真正的图标在活动栏中
            document.body.appendChild(element);
            
            console.log(`✅ Ribbon icon added to activity bar: ${title} (${iconId})`);
            return element;
          } catch (error) {
            console.error('Failed to add ribbon icon to activity bar:', error);
            // 回退到简单的DOM元素
            const element = document.createElement('div');
            element.innerHTML = icon;
            element.title = title;
            element.onclick = callback;
            return element;
          }
        } else {
          console.warn('Molecule activityBar API not available, using fallback');
          // 回退到简单的DOM元素
          const element = document.createElement('div');
          element.innerHTML = icon;
          element.title = title;
          element.onclick = callback;
          return element;
        }
      },
      addStatusBarItem: () => {
        // 实现状态栏项目添加逻辑 - 使用 Molecule 状态栏 API
        if (this.moleculeContext && this.moleculeContext.statusBar) {
          try {
            // 生成唯一的ID
            const itemId = `obsidian-status-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // 添加到 Molecule 状态栏 - 返回一个简单的React组件
            this.moleculeContext.statusBar.add({
              id: itemId,
              name: 'Obsidian Plugin Status',
              render: () => {
                // 返回一个简单的React元素而不是DOM元素
                return React.createElement('div', {
                  id: itemId,
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    fontSize: '12px',
                    color: 'var(--statusBar-foreground)'
                  }
                }, 'Plugin Status');
              }
            });
            
            console.log(`✅ Status bar item added: ${itemId}`);
            
            // 返回一个占位符元素，用于Obsidian插件API兼容性
            const placeholder = document.createElement('div');
            placeholder.style.display = 'none';
            return placeholder;
          } catch (error) {
            console.error('Failed to add status bar item:', error);
            // 回退到隐藏的DOM元素
            const placeholder = document.createElement('div');
            placeholder.style.display = 'none';
            return placeholder;
          }
        } else {
          console.warn('Molecule statusBar API not available, using fallback');
          // 回退到隐藏的DOM元素
          const placeholder = document.createElement('div');
          placeholder.style.display = 'none';
          return placeholder;
        }
      },
      addSettingTab: (tab: PluginSettingTab) => {
        // 实现设置标签页添加逻辑
      }
    };
  }

  private createCommands(): Commands {
    return {
      addCommand: (command: Command) => {
        // 实现命令添加逻辑
        return command;
      },
      removeCommand: (commandId: string) => {
        // 实现命令移除逻辑
      },
      executeCommandById: (commandId: string) => {
        // 实现命令执行逻辑
        return false;
      }
    };
  }

  private createSettings(): Settings {
    return {
      addSettingTab: (tab: PluginSettingTab) => {
        // 实现设置标签页添加逻辑
      },
      getSetting: (key: string) => {
        // 实现设置获取逻辑
        return null;
      },
      setSetting: (key: string, value: any) => {
        // 实现设置保存逻辑
      }
    };
  }

  private createStorage(): Storage {
    return {
      loadData: async (pluginId: string) => {
        // 实现数据加载逻辑
        return this.pluginSettings.get(pluginId) || {};
      },
      saveData: async (pluginId: string, data: any) => {
        // 实现数据保存逻辑
        this.pluginSettings.set(pluginId, data);
      }
    };
  }

  private createEditor(): Editor {
    return {
      registerMarkdownPostProcessor: (postProcessor: MarkdownPostProcessor, sortOrder?: number) => {
        // 实现 Markdown 后处理器注册逻辑
        return postProcessor;
      },
      registerMarkdownCodeBlockProcessor: (
        language: string, 
        handler: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<any> | void, 
        sortOrder?: number
      ) => {
        // 实现代码块处理器注册逻辑
        return {} as MarkdownPostProcessor;
      },
      registerEditorExtension: (extension: any) => {
        // 实现编辑器扩展注册逻辑
      }
    };
  }

  private loadLocalStorage(key: string): any | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  private saveLocalStorage(key: string, data: unknown | null): void {
    try {
      if (data === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * 检查插件依赖
   */
  private async checkDependencies(plugin: IPlugin): Promise<void> {
    for (const dep of plugin.dependencies) {
      if (!this.enabledPlugins.has(dep)) {
        throw new Error(`Plugin ${plugin.id} depends on ${dep} which is not enabled`);
      }
    }
  }

  /**
   * 获取所有插件
   */
  getAllPlugins(): IPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * 获取启用的插件
   */
  getEnabledPlugins(): IPlugin[] {
    return Array.from(this.enabledPlugins).map(id => this.plugins.get(id)!);
  }

  /**
   * 获取插件状态
   */
  getPluginStatus(pluginId: string): PluginStatus | undefined {
    return this.plugins.get(pluginId)?.status;
  }

  /**
   * 获取指定插件
   */
  getPlugin(pluginId: string): IPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  /**
   * 获取 App 实例
   */
  getApp(): App {
    return this.app;
  }
}
