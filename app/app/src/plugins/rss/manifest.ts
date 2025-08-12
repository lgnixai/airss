import { IPluginManifest } from '../../core/pluginSystem/types';
import { RssPlugin } from './RssPlugin';

export const RssPluginManifest: IPluginManifest = {
  id: 'rss-plugin',
  name: 'RSS 阅读器',
  version: '1.0.0',
  description: '一个简单的 RSS 阅读器插件，可以订阅和阅读 RSS 源',
  author: 'Molecule Notes Team',
  dependencies: [],
  pluginClass: RssPlugin,
  minAppVersion: '1.0.0',
  isDesktopOnly: false
};
