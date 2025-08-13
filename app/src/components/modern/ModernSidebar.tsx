import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronDown, 
  ChevronRight, 
  File, 
  Folder, 
  FolderOpen,
  Search,
  MoreHorizontal,
  Plus
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  isOpen?: boolean;
  children?: FileItem[];
  icon?: string;
}

interface ModernSidebarProps {
  title?: string;
  files?: FileItem[];
  onFileSelect?: (fileId: string) => void;
  selectedFile?: string;
}

export function ModernSidebar({ 
  title = "资源管理器", 
  files = [], 
  onFileSelect, 
  selectedFile 
}: ModernSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (items: FileItem[], level = 0): React.ReactNode => {
    return items.map((item) => {
      const isExpanded = expandedFolders.has(item.id);
      const isSelected = selectedFile === item.id;
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div key={item.id}>
          <div
            className={`flex items-center px-2 py-1 rounded-md cursor-pointer transition-colors ${
              isSelected 
                ? 'bg-accent text-accent-foreground' 
                : 'hover:bg-muted/50'
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => {
              if (item.type === 'folder') {
                toggleFolder(item.id);
              } else {
                onFileSelect?.(item.id);
              }
            }}
          >
            {item.type === 'folder' ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 mr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(item.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            ) : (
              <div className="w-4 mr-1" />
            )}
            
            {item.type === 'folder' ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 mr-2 text-blue-500" />
              )
            ) : (
              <File className="h-4 w-4 mr-2 text-gray-500" />
            )}
            
            <span className="flex-1 text-sm truncate">{item.name}</span>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
          
          {item.type === 'folder' && isExpanded && hasChildren && (
            <div className="ml-4">
              {renderFileTree(item.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const filteredFiles = files.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="h-full rounded-none border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="search" className="sr-only">
            搜索文件
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              id="search"
              placeholder="搜索文件..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-6 h-8 text-xs"
            />
          </div>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="p-0 flex-1 overflow-auto">
        <div className="p-2 space-y-1">
          {filteredFiles.length > 0 ? (
            renderFileTree(filteredFiles)
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">没有找到文件</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
