import { IPluginManifest } from '../../core/pluginSystem/types';
import { AiAssistantPlugin } from './AiAssistantPlugin';

export const AiAssistantPluginManifest: IPluginManifest = {
  id: 'ai-assistant-plugin',
  name: 'AI 助手',
  version: '2.0.0',
  description: '基于 Ollama 的智能AI助手，支持文章总结、翻译、解释、代码审查、优化建议和自由对话',
  author: 'Molecule Notes Team',
  dependencies: [],
  pluginClass: AiAssistantPlugin,
  minAppVersion: '1.0.0',
  isDesktopOnly: false
};

