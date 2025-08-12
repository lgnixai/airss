import { IPluginManifest } from '../../core/pluginSystem/types';
import { ExcalidrawPlugin } from './ExcalidrawPlugin';

export const excalidrawPluginManifest: IPluginManifest = {
  id: 'excalidraw-plugin',
  name: 'Excalidraw 白板',
  version: '1.0.0',
  description: '一个简单的 Excalidraw 白板插件，提供无限画布功能',
  author: 'Molecule Team',
  dependencies: [],
  pluginClass: ExcalidrawPlugin,
  minAppVersion: '1.0.0',
  isDesktopOnly: false
};
    