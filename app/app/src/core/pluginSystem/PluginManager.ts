import { IPlugin, IPluginManifest, IPluginAPI, PluginStatus } from './types';

// 浏览器兼容的事件发射器
class EventEmitter {
  private events: { [key: string]: Function[] } = {};

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

export class PluginManager extends EventEmitter {
  private plugins: Map<string, IPlugin> = new Map();
  private pluginAPIs: Map<string, IPluginAPI> = new Map();
  private enabledPlugins: Set<string> = new Set();
  private pluginSettings: Map<string, any> = new Map();
  private moleculeContext: any;

  constructor(moleculeContext?: any) {
    super();
    this.moleculeContext = moleculeContext;
  }

  /**
   * 注册插件
   */
  async registerPlugin(manifest: IPluginManifest, pluginClass: any): Promise<void> {
    const pluginId = manifest.id;
    
    if (this.plugins.has(pluginId)) {
      throw new Error(`Plugin ${pluginId} is already registered`);
    }

    const plugin: IPlugin = {
      id: pluginId,
      name: manifest.name,
      version: manifest.version,
      description: manifest.description,
      author: manifest.author,
      dependencies: manifest.dependencies || [],
      status: PluginStatus.REGISTERED,
      manifest,
      instance: null,
      api: null
    };

    this.plugins.set(pluginId, plugin);
    this.emit('pluginRegistered', plugin);
  }

  /**
   * 启用插件
   */
  async enablePlugin(pluginId: string): Promise<void> {
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
      // 创建插件实例
      const PluginClass = plugin.manifest.pluginClass;
      const instance = new PluginClass();
      
      // 创建插件 API
      const api = this.createPluginAPI(pluginId);
      
      // 初始化插件
      if (instance.onload) {
        await instance.onload(api);
      }

      plugin.instance = instance;
      plugin.api = api;
      plugin.status = PluginStatus.ENABLED;
      
      this.enabledPlugins.add(pluginId);
      this.emit('pluginEnabled', plugin);
      
    } catch (error) {
      plugin.status = PluginStatus.ERROR;
      this.emit('pluginError', plugin, error);
      throw error;
    }
  }

  /**
   * 禁用插件
   */
  async disablePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin || !this.enabledPlugins.has(pluginId)) {
      return;
    }

    try {
      // 调用插件的卸载方法
      if (plugin.instance && plugin.instance.onunload) {
        await plugin.instance.onunload();
      }

      plugin.instance = null;
      plugin.api = null;
      plugin.status = PluginStatus.REGISTERED;
      
      this.enabledPlugins.delete(pluginId);
      this.emit('pluginDisabled', plugin);
      
    } catch (error) {
      this.emit('pluginError', plugin, error);
      throw error;
    }
  }

  /**
   * 创建插件 API
   */
  private createPluginAPI(pluginId: string): IPluginAPI {
    const api: IPluginAPI = {
      // 文件系统 API
      fileSystem: {
        readFile: (path: string) => this.readFile(path),
        writeFile: (path: string, content: string) => this.writeFile(path, content),
        deleteFile: (path: string) => this.deleteFile(path),
        listFiles: (path: string) => this.listFiles(path),
        createFolder: (path: string) => this.createFolder(path),
      },

      // UI API
      ui: {
        addRibbonIcon: (icon: string, title: string, callback: () => void) => 
          this.addRibbonIcon(pluginId, icon, title, callback),
        addStatusBarItem: (element: HTMLElement) => 
          this.addStatusBarItem(pluginId, element),
        addSettingTab: (tab: any) => this.addSettingTab(pluginId, tab),
        registerView: (id: string, view: any) => this.registerView(pluginId, id, view),
        addActivityBarItem: (item: {
          id: string;
          name: string;
          icon: string;
          sortIndex?: number;
          alignment?: 'top' | 'bottom';
          onClick: () => void;
        }) => this.addActivityBarItem(pluginId, item),
        addSidebarItem: (item: {
          id: string;
          name: string;
          render: () => HTMLElement;
        }) => this.addSidebarItem(pluginId, item),
        setAuxiliaryBar: (visible: boolean) => this.setAuxiliaryBar(visible),
        addAuxiliaryBarItem: (item: {
          id: string;
          name: string;
          icon: string;
          render: () => HTMLElement;
        }) => this.addAuxiliaryBarItem(item),
        setCurrentAuxiliaryBar: (id: string) => this.setCurrentAuxiliaryBar(id),
      },

      // 事件 API
      events: {
        on: (event: string, callback: (...args: any[]) => void) => this.on(event, callback),
        off: (event: string, callback: (...args: any[]) => void) => this.off(event, callback),
        emit: (event: string, ...args: any[]) => this.emit(event, ...args),
      },

      // 设置 API
      settings: {
        get: (key: string, defaultValue?: any) => this.getSetting(pluginId, key, defaultValue),
        set: (key: string, value: any) => this.setSetting(pluginId, key, value),
        getAll: () => this.getAllSettings(pluginId),
      },

      // AI API
      ai: {
        chat: (message: string) => this.aiChat(message),
        summarize: (content: string) => this.aiSummarize(content),
        translate: (content: string, targetLang: string) => this.aiTranslate(content, targetLang),
      },

      // 工具 API
      utils: {
        debounce: (func: Function, wait: number) => this.debounce(func, wait),
        throttle: (func: Function, wait: number) => this.throttle(func, wait),
        generateId: () => this.generateId(),
      },

      // Molecule 上下文
      molecule: this.moleculeContext,
    };

    this.pluginAPIs.set(pluginId, api);
    return api;
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

  // 文件系统方法
  private async readFile(path: string): Promise<string> {
    // 实现文件读取逻辑
    return '';
  }

  private async writeFile(path: string, content: string): Promise<void> {
    // 实现文件写入逻辑
  }

  private async deleteFile(path: string): Promise<void> {
    // 实现文件删除逻辑
  }

  private async listFiles(path: string): Promise<string[]> {
    // 实现文件列表逻辑
    return [];
  }

  private async createFolder(path: string): Promise<void> {
    // 实现文件夹创建逻辑
  }

  // UI 方法
  private addRibbonIcon(pluginId: string, icon: string, title: string, callback: () => void): void {
    // 实现添加图标逻辑
  }

  private addStatusBarItem(pluginId: string, element: HTMLElement): void {
    // 实现添加状态栏项目逻辑
  }

  private addSettingTab(pluginId: string, tab: any): void {
    // 实现添加设置标签页逻辑
  }

  private registerView(pluginId: string, id: string, view: any): void {
    // 实现注册视图逻辑
  }

  private addActivityBarItem(pluginId: string, item: {
    id: string;
    name: string;
    icon: string;
    sortIndex?: number;
    alignment?: 'top' | 'bottom';
    onClick: () => void;
  }): void {
    console.log('Adding activity bar item:', item);
    if (this.moleculeContext && this.moleculeContext.activityBar) {
      this.moleculeContext.activityBar.add({
        id: item.id,
        name: item.name,
        icon: item.icon,
        sortIndex: item.sortIndex,
        alignment: item.alignment || 'top',
        onClick: item.onClick
      });
    }
  }

  private addSidebarItem(pluginId: string, item: {
    id: string;
    name: string;
    render: () => HTMLElement;
  }): void {
    console.log('Adding sidebar item:', item);
    if (this.moleculeContext && this.moleculeContext.sidebar) {
      this.moleculeContext.sidebar.add({
        id: item.id,
        name: item.name,
        render: item.render
      });
    }
  }

  private setAuxiliaryBar(visible: boolean): void {
    console.log(`Setting auxiliary bar visibility: ${visible}`);
    if (this.moleculeContext && this.moleculeContext.layout) {
      this.moleculeContext.layout.setAuxiliaryBar(visible);
    }
  }

  private addAuxiliaryBarItem(item: {
    id: string;
    name: string;
    icon: string;
    render: () => HTMLElement;
  }): void {
    console.log('Adding auxiliary bar item:', item);
    if (this.moleculeContext && this.moleculeContext.auxiliaryBar) {
      this.moleculeContext.auxiliaryBar.add({
        id: item.id,
        name: item.name,
        icon: item.icon,
        render: item.render
      });
    }
  }

  private setCurrentAuxiliaryBar(id: string): void {
    console.log(`Setting current auxiliary bar: ${id}`);
    if (this.moleculeContext && this.moleculeContext.auxiliaryBar) {
      this.moleculeContext.auxiliaryBar.setCurrent(id);
    }
  }

  // 设置方法
  private getSetting(pluginId: string, key: string, defaultValue?: any): any {
    const settings = this.pluginSettings.get(pluginId) || {};
    return settings[key] !== undefined ? settings[key] : defaultValue;
  }

  private setSetting(pluginId: string, key: string, value: any): void {
    const settings = this.pluginSettings.get(pluginId) || {};
    settings[key] = value;
    this.pluginSettings.set(pluginId, settings);
  }

  private getAllSettings(pluginId: string): any {
    return this.pluginSettings.get(pluginId) || {};
  }

  // AI 方法
  private async aiChat(message: string): Promise<string> {
    // 实现 AI 聊天逻辑
    return '';
  }

  private async aiSummarize(content: string): Promise<string> {
    // 实现 AI 总结逻辑
    return '';
  }

  private async aiTranslate(content: string, targetLang: string): Promise<string> {
    // 实现 AI 翻译逻辑
    return '';
  }

  // 工具方法
  private debounce(func: Function, wait: number): Function {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  private throttle(func: Function, wait: number): Function {
    let inThrottle: boolean;
    return function executedFunction(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, wait);
      }
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
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
}