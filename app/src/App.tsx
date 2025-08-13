import React, { useState } from 'react';
import { ModernLayout } from './components/modern/ModernLayout';
import { ShadcnPOC } from './components/ShadcnPOC';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

export default function App() {
  const [showPOC, setShowPOC] = useState(false);

  if (showPOC) {
    return (
      <div className="h-screen w-screen bg-background">
        <div className="p-4 border-b">
          <Button 
            variant="outline" 
            onClick={() => setShowPOC(false)}
            className="mb-4"
          >
            ← 返回现代化布局
          </Button>
        </div>
        <ShadcnPOC />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background">
      <ModernLayout>
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Molecule 现代化改造
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  基于 shadcn/ui 的现代化组件改造已完成！
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">✅ 已完成</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Activity Bar 现代化</li>
                        <li>• Sidebar 现代化</li>
                        <li>• Status Bar 现代化</li>
                        <li>• 主题系统集成</li>
                        <li>• 响应式设计</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">🚀 新特性</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 现代化 UI 设计</li>
                        <li>• 更好的可访问性</li>
                        <li>• 流畅的动画效果</li>
                        <li>• 统一的设计语言</li>
                        <li>• 更好的开发体验</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => setShowPOC(true)}
                    variant="default"
                  >
                    查看概念验证
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => console.log('现代化改造完成！')}
                  >
                    测试交互
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ModernLayout>
    </div>
  );
}
