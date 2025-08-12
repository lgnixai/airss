const fs = require('fs');
const path = require('path');

// 要保留的插件
const KEEP_PLUGINS = ['hello'];

// 要删除的插件
const PLUGINS_TO_REMOVE = [
    'aiAssistant',
    'excalidraw', 
    'rss',
    'obsidianExample',
    'markdownEditor'
];

function cleanupPlugins() {
    console.log('🧹 开始清理插件系统...');
    
    const pluginsDir = path.join(__dirname, '../plugins');
    
    if (!fs.existsSync(pluginsDir)) {
        console.log('❌ 插件目录不存在');
        return;
    }
    
    // 获取所有插件目录
    const plugins = fs.readdirSync(pluginsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    console.log(`📋 发现插件: ${plugins.join(', ')}`);
    
    // 删除不需要的插件
    let removedCount = 0;
    for (const plugin of plugins) {
        if (!KEEP_PLUGINS.includes(plugin)) {
            const pluginPath = path.join(pluginsDir, plugin);
            try {
                fs.rmSync(pluginPath, { recursive: true, force: true });
                console.log(`🗑️ 已删除插件: ${plugin}`);
                removedCount++;
            } catch (error) {
                console.log(`⚠️ 删除插件 ${plugin} 失败: ${error.message}`);
            }
        } else {
            console.log(`✅ 保留插件: ${plugin}`);
        }
    }
    
    console.log(`\n🎯 清理完成:`);
    console.log(`- 删除插件: ${removedCount} 个`);
    console.log(`- 保留插件: ${KEEP_PLUGINS.join(', ')}`);
    
    // 验证清理结果
    const remainingPlugins = fs.readdirSync(pluginsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    console.log(`- 剩余插件: ${remainingPlugins.join(', ')}`);
    
    // 检查是否有意外删除的插件
    const missingPlugins = KEEP_PLUGINS.filter(plugin => !remainingPlugins.includes(plugin));
    if (missingPlugins.length > 0) {
        console.log(`⚠️ 警告: 以下应该保留的插件被意外删除: ${missingPlugins.join(', ')}`);
    }
}

// 更新插件管理器配置
function updatePluginManager() {
    console.log('\n🔧 更新插件管理器配置...');
    
    const pluginManagerPath = path.join(__dirname, '../core/pluginSystem/PluginManager.ts');
    
    if (!fs.existsSync(pluginManagerPath)) {
        console.log('❌ 插件管理器文件不存在');
        return;
    }
    
    try {
        let content = fs.readFileSync(pluginManagerPath, 'utf8');
        
        // 移除对其他插件的引用
        const lines = content.split('\n');
        const filteredLines = lines.filter(line => {
            // 保留 Hello 插件相关的导入和引用
            if (line.includes('hello') || line.includes('Hello')) {
                return true;
            }
            
            // 移除其他插件的导入
            if (line.includes('import') && (
                line.includes('aiAssistant') ||
                line.includes('excalidraw') ||
                line.includes('rss') ||
                line.includes('obsidianExample') ||
                line.includes('markdownEditor')
            )) {
                console.log(`🗑️ 移除导入: ${line.trim()}`);
                return false;
            }
            
            // 移除其他插件的注册
            if (line.includes('registerPlugin') && (
                line.includes('aiAssistant') ||
                line.includes('excalidraw') ||
                line.includes('rss') ||
                line.includes('obsidianExample') ||
                line.includes('markdownEditor')
            )) {
                console.log(`🗑️ 移除注册: ${line.trim()}`);
                return false;
            }
            
            return true;
        });
        
        fs.writeFileSync(pluginManagerPath, filteredLines.join('\n'));
        console.log('✅ 插件管理器配置已更新');
        
    } catch (error) {
        console.log(`❌ 更新插件管理器失败: ${error.message}`);
    }
}

// 更新 TestExtension
function updateTestExtension() {
    console.log('\n🔧 更新 TestExtension...');
    
    const testExtensionPath = path.join(__dirname, '../../../src/extensions/TestExtension.tsx');
    
    if (!fs.existsSync(testExtensionPath)) {
        console.log('❌ TestExtension 文件不存在');
        return;
    }
    
    try {
        let content = fs.readFileSync(testExtensionPath, 'utf8');
        
        // 简化 TestExtension，只保留核心功能
        const simplifiedContent = `import { IContributeType, IExtension, IMoleculeContext } from '@dtinsight/molecule';
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
`;

        fs.writeFileSync(testExtensionPath, simplifiedContent);
        console.log('✅ TestExtension 已简化');
        
    } catch (error) {
        console.log(`❌ 更新 TestExtension 失败: ${error.message}`);
    }
}

// 主函数
function main() {
    console.log('🚀 开始插件系统清理...\n');
    
    cleanupPlugins();
    updatePluginManager();
    updateTestExtension();
    
    console.log('\n🎉 插件系统清理完成！');
    console.log('📋 现在只保留了 Hello 插件，其他插件已被删除。');
    console.log('🔧 插件管理器和 TestExtension 已更新。');
}

if (require.main === module) {
    main();
}

module.exports = { cleanupPlugins, updatePluginManager, updateTestExtension };
