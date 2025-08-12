import { IPluginManifest } from '../../core/pluginSystem/types';
import { HelloPlugin } from './HelloPlugin';

export const helloPluginManifest: IPluginManifest = {
  id: 'hello-plugin',
  name: 'Hello Plugin',
  version: '1.0.0',
  description: '一个简单的 Hello World 插件，用于验证插件开发流程',
  author: 'Molecule Team',
  dependencies: [],
  pluginClass: HelloPlugin,
  minAppVersion: '1.0.0',
  isDesktopOnly: false
};
