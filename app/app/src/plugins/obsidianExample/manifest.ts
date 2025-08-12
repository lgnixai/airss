import { IPluginManifest } from '../../core/pluginSystem/types';
import { ObsidianExamplePlugin } from './ObsidianExamplePlugin';

export const obsidianExampleManifest: IPluginManifest = {
  id: 'obsidian-example-plugin',
  name: 'Obsidian Example Plugin',
  version: '1.0.0',
  description: '一个展示 Obsidian 兼容插件系统的示例插件',
  author: 'Molecule Team',
  dependencies: [],
  pluginClass: ObsidianExamplePlugin,
  minAppVersion: '1.0.0',
  isDesktopOnly: false
};
