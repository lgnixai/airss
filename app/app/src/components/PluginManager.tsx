import React, { useState, useEffect } from 'react';

interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  status: string;
}

interface PluginManagerProps {
  pluginSystem: any;
}

export default function PluginManager({ pluginSystem }: PluginManagerProps) {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pluginSystem) {
      loadPlugins();
    }
  }, [pluginSystem]);

  const loadPlugins = () => {
    try {
      const allPlugins = pluginSystem.getAllPlugins();
      setPlugins(allPlugins);
    } catch (error) {
      console.error('Failed to load plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlugin = async (pluginId: string, enabled: boolean) => {
    try {
      if (enabled) {
        await pluginSystem.getPluginManager().enablePlugin(pluginId);
      } else {
        await pluginSystem.getPluginManager().disablePlugin(pluginId);
      }
      loadPlugins(); // 重新加载插件列表
    } catch (error) {
      console.error('Failed to toggle plugin:', error);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>加载插件中...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>插件管理器</h2>
      <p>管理已安装的插件</p>
      
      <div style={{ marginTop: '20px' }}>
        {plugins.length === 0 ? (
          <p>没有找到插件</p>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {plugins.map((plugin) => (
              <div 
                key={plugin.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{plugin.name}</h3>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>{plugin.description}</p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
                      版本: {plugin.version} | 作者: {plugin.author}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span 
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: plugin.status === 'enabled' ? '#4caf50' : '#f44336',
                        color: 'white'
                      }}
                    >
                      {plugin.status === 'enabled' ? '已启用' : '已禁用'}
                    </span>
                    <button
                      onClick={() => togglePlugin(plugin.id, plugin.status !== 'enabled')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        backgroundColor: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      {plugin.status === 'enabled' ? '禁用' : '启用'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
