import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  FileText, 
  Search, 
  Settings, 
  GitBranch, 
  Bug,
  Lightbulb,
  Package
} from 'lucide-react';

interface ActivityItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tooltip: string;
  badge?: number;
}

interface ModernActivityBarProps {
  onActivityChange?: (activityId: string) => void;
  activeActivity?: string;
}

export function ModernActivityBar({ onActivityChange, activeActivity = 'explorer' }: ModernActivityBarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const activities: ActivityItem[] = [
    {
      id: 'explorer',
      icon: Home,
      label: '资源管理器',
      tooltip: '文件资源管理器'
    },
    {
      id: 'search',
      icon: Search,
      label: '搜索',
      tooltip: '全局搜索'
    },
    {
      id: 'git',
      icon: GitBranch,
      label: '源代码管理',
      tooltip: 'Git 源代码管理',
      badge: 2
    },
    {
      id: 'debug',
      icon: Bug,
      label: '运行和调试',
      tooltip: '调试和运行程序'
    },
    {
      id: 'extensions',
      icon: Package,
      label: '扩展',
      tooltip: '扩展管理',
      badge: 1
    }
  ];

  const bottomActivities: ActivityItem[] = [
    {
      id: 'ai-assistant',
      icon: Lightbulb,
      label: 'AI 助手',
      tooltip: 'AI 智能助手'
    },
    {
      id: 'settings',
      icon: Settings,
      label: '设置',
      tooltip: '设置和首选项'
    }
  ];

  const handleActivityClick = (activityId: string) => {
    onActivityChange?.(activityId);
  };

  return (
    <Card className="w-16 h-full rounded-none border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardContent className="p-0 h-full flex flex-col">
        {/* 主要活动区域 */}
        <div className="flex-1 flex flex-col items-center py-2 space-y-1">
          {activities.map((activity) => {
            const Icon = activity.icon;
            const isActive = activeActivity === activity.id;
            const isHovered = hoveredItem === activity.id;
            
            return (
              <div key={activity.id} className="relative">
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="icon"
                  className={`h-12 w-12 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-secondary text-secondary-foreground shadow-sm' 
                      : isHovered 
                        ? 'bg-muted/50 text-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => handleActivityClick(activity.id)}
                  onMouseEnter={() => setHoveredItem(activity.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Icon className="h-5 w-5" />
                  {activity.badge && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                      {activity.badge}
                    </span>
                  )}
                </Button>
                
                {/* 工具提示 */}
                {isHovered && (
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 z-50">
                    <div className="bg-popover text-popover-foreground px-2 py-1 rounded-md text-sm whitespace-nowrap shadow-lg border">
                      {activity.tooltip}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Separator className="mx-2" />

        {/* 底部活动区域 */}
        <div className="flex flex-col items-center py-2 space-y-1">
          {bottomActivities.map((activity) => {
            const Icon = activity.icon;
            const isActive = activeActivity === activity.id;
            const isHovered = hoveredItem === activity.id;
            
            return (
              <div key={activity.id} className="relative">
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="icon"
                  className={`h-12 w-12 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-secondary text-secondary-foreground shadow-sm' 
                      : isHovered 
                        ? 'bg-muted/50 text-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => handleActivityClick(activity.id)}
                  onMouseEnter={() => setHoveredItem(activity.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Icon className="h-5 w-5" />
                </Button>
                
                {/* 工具提示 */}
                {isHovered && (
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 z-50">
                    <div className="bg-popover text-popover-foreground px-2 py-1 rounded-md text-sm whitespace-nowrap shadow-lg border">
                      {activity.tooltip}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
