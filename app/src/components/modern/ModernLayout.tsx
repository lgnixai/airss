import React, { useState } from 'react';
import { ModernActivityBar } from './ModernActivityBar';
import { ModernSidebar } from './ModernSidebar';
import { ModernStatusBar } from './ModernStatusBar';
import { ShadcnPOC } from '../ShadcnPOC';

interface ModernLayoutProps {
  children?: React.ReactNode;
}

export function ModernLayout({ children }: ModernLayoutProps) {
  const [activeActivity, setActiveActivity] = useState('explorer');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // 模拟文件数据
  const mockFiles = [
    {
      id: 'src',
      name: 'src',
      type: 'folder' as const,
      children: [
        {
          id: 'components',
          name: 'components',
          type: 'folder' as const,
          children: [
            { id: 'App.tsx', name: 'App.tsx', type: 'file' as const },
            { id: 'main.tsx', name: 'main.tsx', type: 'file' as const }
          ]
        },
        {
          id: 'utils',
          name: 'utils',
          type: 'folder' as const,
          children: [
            { id: 'index.ts', name: 'index.ts', type: 'file' as const }
          ]
        }
      ]
    },
    {
      id: 'public',
      name: 'public',
      type: 'folder' as const,
      children: [
        { id: 'index.html', name: 'index.html', type: 'file' as const }
      ]
    },
    { id: 'package.json', name: 'package.json', type: 'file' as const },
    { id: 'README.md', name: 'README.md', type: 'file' as const }
  ];

  const handleActivityChange = (activityId: string) => {
    setActiveActivity(activityId);
    console.log('Activity changed to:', activityId);
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFile(fileId);
    console.log('File selected:', fileId);
  };

  const handleStatusItemClick = (itemId: string) => {
    console.log('Status item clicked:', itemId);
  };

  const renderContent = () => {
    switch (activeActivity) {
      case 'explorer':
        return (
          <div className="flex-1 flex flex-col">
            <ModernSidebar
              title="资源管理器"
              files={mockFiles}
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />
          </div>
        );
      case 'search':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">全局搜索</h2>
              <p className="text-muted-foreground">搜索功能开发中...</p>
            </div>
          </div>
        );
      case 'git':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">源代码管理</h2>
              <p className="text-muted-foreground">Git 功能开发中...</p>
            </div>
          </div>
        );
      case 'debug':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">运行和调试</h2>
              <p className="text-muted-foreground">调试功能开发中...</p>
            </div>
          </div>
        );
      case 'extensions':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">扩展管理</h2>
              <p className="text-muted-foreground">扩展功能开发中...</p>
            </div>
          </div>
        );
      case 'ai-assistant':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">AI 助手</h2>
              <p className="text-muted-foreground">AI 功能开发中...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">设置</h2>
              <p className="text-muted-foreground">设置功能开发中...</p>
            </div>
          </div>
        );
      default:
        return children || (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">欢迎使用 Molecule</h2>
              <p className="text-muted-foreground">现代化的代码编辑器</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      {/* 主内容区域 */}
      <div className="flex-1 flex">
        {/* Activity Bar */}
        <ModernActivityBar
          activeActivity={activeActivity}
          onActivityChange={handleActivityChange}
        />
        
        {/* 内容区域 */}
        <div className="flex-1 flex flex-col">
          {renderContent()}
        </div>
      </div>
      
      {/* Status Bar */}
      <ModernStatusBar onItemClick={handleStatusItemClick} />
    </div>
  );
}
