import { PluginManager } from './pluginSystem/PluginManager';
import { RssPluginManifest } from '../plugins/rss/manifest';
// import { AiAssistantPluginManifest } from '../plugins/aiAssistant/manifest';

export class PluginSystemService {
  private pluginManager: PluginManager;
  private moleculeContext: any;

  constructor(moleculeContext: any) {
    this.moleculeContext = moleculeContext;
    this.pluginManager = new PluginManager(moleculeContext);
    this.setupPluginManager();
  }

  private setupPluginManager() {
    // 监听插件事件
    this.pluginManager.on('pluginRegistered', (plugin: any) => {
      console.log('Plugin registered:', plugin.name);
    });

    this.pluginManager.on('pluginEnabled', (plugin: any) => {
      console.log('Plugin enabled:', plugin.name);
      // 安全地调用通知
      try {
        if (this.moleculeContext.notification && this.moleculeContext.notification.open) {
          this.moleculeContext.notification.open({
            id: `plugin-enabled-${plugin.id}`,
            value: `插件 "${plugin.name}" 已启用`,
            type: 'success'
          });
        }
      } catch (error) {
        console.log('Plugin enabled:', plugin.name);
      }
    });

    this.pluginManager.on('pluginError', (plugin: any, error: any) => {
      console.error('Plugin error:', plugin.name, error);
      // 安全地调用通知
      try {
        if (this.moleculeContext.notification && this.moleculeContext.notification.open) {
          this.moleculeContext.notification.open({
            id: `plugin-error-${plugin.id}`,
            value: `插件 "${plugin.name}" 加载失败: ${error.message}`,
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Plugin error:', plugin.name, error);
      }
    });
  }

  /**
   * 初始化插件系统
   */
  async initialize() {
    console.log('Initializing plugin system...');
    
    // 注册内置插件
    await this.registerBuiltinPlugins();
    
    // 启用所有插件
    await this.enableAllPlugins();
    
    console.log('Plugin system initialized');
  }

  /**
   * 注册内置插件
   */
  private async registerBuiltinPlugins() {
    // 注册 RSS 插件
    await this.pluginManager.registerPlugin(RssPluginManifest, RssPluginManifest.pluginClass);
    
    // 注册 AI 助手插件 - 暂时禁用，使用TestExtension中的新实现
    // await this.pluginManager.registerPlugin(AiAssistantPluginManifest, AiAssistantPluginManifest.pluginClass);
    
    // 这里可以添加更多内置插件
  }

  /**
   * 启用所有插件
   */
  private async enableAllPlugins() {
    const plugins = this.pluginManager.getAllPlugins();
    
    for (const plugin of plugins) {
      try {
        await this.pluginManager.enablePlugin(plugin.id);
      } catch (error) {
        console.error(`Failed to enable plugin ${plugin.id}:`, error);
      }
    }
  }

  /**
   * 获取插件管理器
   */
  getPluginManager(): PluginManager {
    return this.pluginManager;
  }

  /**
   * 获取所有插件
   */
  getAllPlugins() {
    return this.pluginManager.getAllPlugins();
  }

  /**
   * 获取启用的插件
   */
  getEnabledPlugins() {
    return this.pluginManager.getEnabledPlugins();
  }
}
