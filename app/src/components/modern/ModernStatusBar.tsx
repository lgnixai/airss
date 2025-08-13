import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  GitBranch, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Wifi,
  Battery,
  Clock
} from 'lucide-react';

interface StatusItem {
  id: string;
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

interface ModernStatusBarProps {
  items?: StatusItem[];
  onItemClick?: (itemId: string) => void;
}

export function ModernStatusBar({ items = [], onItemClick }: ModernStatusBarProps) {
  const defaultItems: StatusItem[] = [
    {
      id: 'git',
      icon: GitBranch,
      label: 'main',
      variant: 'default'
    },
    {
      id: 'linting',
      icon: CheckCircle,
      label: 'TypeScript',
      variant: 'success'
    },
    {
      id: 'problems',
      icon: AlertCircle,
      label: '0 个问题',
      variant: 'default'
    }
  ];

  const systemItems: StatusItem[] = [
    {
      id: 'wifi',
      icon: Wifi,
      label: '已连接',
      variant: 'success'
    },
    {
      id: 'battery',
      icon: Battery,
      label: '100%',
      variant: 'success'
    },
    {
      id: 'time',
      icon: Clock,
      label: new Date().toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      variant: 'default'
    }
  ];

  const allItems = [...defaultItems, ...items, ...systemItems];

  const getVariantStyles = (variant: StatusItem['variant']) => {
    switch (variant) {
      case 'success':
        return 'text-green-600 hover:text-green-700';
      case 'warning':
        return 'text-yellow-600 hover:text-yellow-700';
      case 'error':
        return 'text-red-600 hover:text-red-700';
      default:
        return 'text-muted-foreground hover:text-foreground';
    }
  };

  const getIconVariantStyles = (variant: StatusItem['variant']) => {
    switch (variant) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="h-8 rounded-none border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardContent className="p-0 h-full flex items-center justify-between px-2">
        {/* 左侧状态项 */}
        <div className="flex items-center space-x-2">
          {allItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`h-6 px-2 text-xs font-normal ${getVariantStyles(item.variant)}`}
                onClick={() => onItemClick?.(item.id)}
              >
                {Icon && <Icon className={`h-3 w-3 mr-1 ${getIconVariantStyles(item.variant)}`} />}
                {item.label}
              </Button>
            );
          })}
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* 中间状态项 */}
        <div className="flex items-center space-x-2">
          {allItems.slice(3, -3).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`h-6 px-2 text-xs font-normal ${getVariantStyles(item.variant)}`}
                onClick={() => onItemClick?.(item.id)}
              >
                {Icon && <Icon className={`h-3 w-3 mr-1 ${getIconVariantStyles(item.variant)}`} />}
                {item.label}
              </Button>
            );
          })}
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* 右侧系统状态 */}
        <div className="flex items-center space-x-2">
          {allItems.slice(-3).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`h-6 px-2 text-xs font-normal ${getVariantStyles(item.variant)}`}
                onClick={() => onItemClick?.(item.id)}
              >
                {Icon && <Icon className={`h-3 w-3 mr-1 ${getIconVariantStyles(item.variant)}`} />}
                {item.label}
              </Button>
            );
          })}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => onItemClick?.('settings')}
          >
            <Settings className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
