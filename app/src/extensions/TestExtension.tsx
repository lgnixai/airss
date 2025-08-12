import { IContributeType, IExtension, IMoleculeContext } from '@dtinsight/molecule';
import React from 'react';
import { PluginSystemService } from '../core/pluginSystem/PluginSystemService';

export const TestExtension: IExtension = {
    id: 'TestExtension',
    name: 'TestExtension',
    contributes: {
        [IContributeType.Modules]: {},
    },
    activate(molecule: IMoleculeContext, _monaco) {
        console.log('TestExtension activated');
        
        let pluginSystem: PluginSystemService | null = null;
        
        // 默认显示 AuxiliaryBar
        molecule.layout.setAuxiliaryBar(true);

        // 添加辅助工具栏内容
        setTimeout(() => {
            try {
                molecule.auxiliaryBar.add({
                    id: 'ai-assistant',
                    name: 'AI 助手',
                    icon: 'lightbulb',
                    render: () => React.createElement('div', {
                        style: {
                            padding: '20px',
                            color: '#cccccc',
                            backgroundColor: '#252526',
                            height: '100%'
                        }
                    }, [
                        React.createElement('h2', { key: 'title' }, 'AI 助手'),
                        React.createElement('p', { key: 'content' }, '这是一个 AI 助手面板，用于测试辅助工具栏功能。'),
                        React.createElement('p', { key: 'status' }, '状态: 正常运行')
                    ])
                });
                
                // 设置为当前激活的辅助工具栏
                molecule.auxiliaryBar.setCurrent('ai-assistant');
                
                // 确保辅助工具栏可见
                molecule.layout.setAuxiliaryBar(true);
                
                console.log('AI Assistant added to auxiliary bar');
                console.log('Auxiliary bar should be visible now');
            } catch (error) {
                console.error('Failed to add AI Assistant to auxiliary bar:', error);
            }
        }, 1000);

        // 添加测试面板到侧边栏
        setTimeout(() => {
            try {
                molecule.sidebar.add({
                    id: 'testPane',
                    title: '测试面板',
                    render: () => React.createElement('div', {
                        style: {
                            padding: '20px',
                            color: '#cccccc',
                            backgroundColor: '#252526',
                            height: '100%'
                        }
                    }, [
                        React.createElement('h2', { key: 'title' }, '测试面板'),
                        React.createElement('p', { key: 'content' }, '这是一个测试面板，用于验证侧边栏功能。'),
                        React.createElement('p', { key: 'status' }, '状态: 正常运行')
                    ])
                });
                
                console.log('Test pane added to sidebar');
            } catch (error) {
                console.error('Failed to add test pane to sidebar:', error);
            }
        }, 1500);

        // 延迟初始化插件系统，确保 Molecule 完全加载
        setTimeout(() => {
            try {
                console.log('Starting plugin system initialization...');
                pluginSystem = new PluginSystemService(molecule);
                pluginSystem.initialize().then(() => {
                    console.log('Plugin system initialized successfully');
                }).catch((error: any) => {
                    console.error('Failed to initialize plugin system:', error);
                });
            } catch (error) {
                console.error('Failed to create plugin system:', error);
            }
        }, 2000);

        // 添加插件管理器到侧边栏
        setTimeout(() => {
            try {
                molecule.sidebar.add({
                    id: 'pluginManager',
                    title: '插件管理器',
                    render: () => React.createElement('div', {
                        style: {
                            padding: '20px',
                            color: '#cccccc',
                            backgroundColor: '#252526',
                            height: '100%'
                        }
                    }, [
                        React.createElement('h2', { key: 'title' }, '插件管理器'),
                        React.createElement('p', { key: 'content' }, '这是插件管理器面板，用于管理已安装的插件。'),
                        React.createElement('p', { key: 'status' }, '状态: 正常运行'),
                        React.createElement('p', { key: 'plugins' }, '已安装插件: Hello Plugin')
                    ])
                });
                
                console.log('Plugin manager added to sidebar');
            } catch (error) {
                console.error('Failed to add plugin manager to sidebar:', error);
            }
        }, 2500);

        console.log('TestExtension setup completed');
    }
};
