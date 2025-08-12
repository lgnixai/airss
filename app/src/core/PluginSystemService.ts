import { PluginManager } from './pluginSystem/PluginManager';
import { ObsidianCompatiblePluginManager } from './pluginSystem/ObsidianCompatiblePluginManager';
import { RssPluginManifest } from '../plugins/rss/manifest';
import { obsidianExampleManifest } from '../plugins/obsidianExample/manifest';
import { helloPluginManifest } from '../plugins/hello/manifest';
// import { AiAssistantPluginManifest } from '../plugins/aiAssistant/manifest';

export class PluginSystemService {
  private pluginManager: PluginManager;
  private obsidianPluginManager: ObsidianCompatiblePluginManager;
  private moleculeContext: any;

  constructor(moleculeContext: any) {
    this.moleculeContext = moleculeContext;
    this.pluginManager = new PluginManager(moleculeContext);
    this.obsidianPluginManager = new ObsidianCompatiblePluginManager(moleculeContext);
    this.setupPluginManager();
    this.setupObsidianPluginManager();
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

  private setupObsidianPluginManager() {
    // 监听 Obsidian 兼容插件事件
    this.obsidianPluginManager.on('pluginRegistered', (plugin: any) => {
      console.log('Obsidian compatible plugin registered:', plugin.name);
    });

    this.obsidianPluginManager.on('pluginEnabled', (plugin: any) => {
      console.log('Obsidian compatible plugin enabled:', plugin.name);
      // 安全地调用通知
      try {
        if (this.moleculeContext.notification && this.moleculeContext.notification.open) {
          this.moleculeContext.notification.open({
            id: `obsidian-plugin-enabled-${plugin.id}`,
            value: `Obsidian 兼容插件 "${plugin.name}" 已启用`,
            type: 'success'
          });
        }
      } catch (error) {
        console.log('Obsidian compatible plugin enabled:', plugin.name);
      }
    });

    this.obsidianPluginManager.on('pluginError', (plugin: any, error: any) => {
      console.error('Obsidian compatible plugin error:', plugin.name, error);
      // 安全地调用通知
      try {
        if (this.moleculeContext.notification && this.moleculeContext.notification.open) {
          this.moleculeContext.notification.open({
            id: `obsidian-plugin-error-${plugin.id}`,
            value: `Obsidian 兼容插件 "${plugin.name}" 加载失败: ${error.message}`,
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Obsidian compatible plugin error:', plugin.name, error);
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
    
    // 注册 Obsidian 兼容插件
    await this.registerObsidianPlugins();
    
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
   * 注册 Obsidian 兼容插件
   */
  private async registerObsidianPlugins() {
    // 注册 Hello 插件 - 使用传统插件管理器，因为它实现了 IPluginClass
    await this.pluginManager.registerPlugin(helloPluginManifest, helloPluginManifest.pluginClass);
    
    // 注册 Obsidian 示例插件
    await this.obsidianPluginManager.registerObsidianPlugin(
      obsidianExampleManifest, 
      obsidianExampleManifest.pluginClass
    );
    
    // 这里可以添加更多 Obsidian 兼容插件
  }

  /**
   * 启用所有插件
   */
  private async enableAllPlugins() {
    // 启用传统插件
    const plugins = this.pluginManager.getAllPlugins();
    for (const plugin of plugins) {
      try {
        await this.pluginManager.enablePlugin(plugin.id);
      } catch (error) {
        console.error(`Failed to enable plugin ${plugin.id}:`, error);
      }
    }

    // 启用 Obsidian 兼容插件
    const obsidianPlugins = this.obsidianPluginManager.getAllPlugins();
    for (const plugin of obsidianPlugins) {
      try {
        await this.obsidianPluginManager.enableObsidianPlugin(plugin.id);
      } catch (error) {
        console.error(`Failed to enable Obsidian plugin ${plugin.id}:`, error);
      }
    }
  }

  /**
   * 获取传统插件管理器
   */
  getPluginManager(): PluginManager {
    return this.pluginManager;
  }

  /**
   * 获取 Obsidian 兼容插件管理器
   */
  getObsidianPluginManager(): ObsidianCompatiblePluginManager {
    return this.obsidianPluginManager;
  }

  /**
   * 获取所有插件（包括传统和 Obsidian 兼容）
   */
  getAllPlugins() {
    const traditionalPlugins = this.pluginManager.getAllPlugins();
    const obsidianPlugins = this.obsidianPluginManager.getAllPlugins();
    return [...traditionalPlugins, ...obsidianPlugins];
  }

  /**
   * 获取启用的插件（包括传统和 Obsidian 兼容）
   */
  getEnabledPlugins() {
    const traditionalPlugins = this.pluginManager.getEnabledPlugins();
    const obsidianPlugins = this.obsidianPluginManager.getEnabledPlugins();
    return [...traditionalPlugins, ...obsidianPlugins];
  }

  /**
   * 获取 Obsidian App 实例
   */
  getObsidianApp() {
    return this.obsidianPluginManager.getApp();
  }
}
