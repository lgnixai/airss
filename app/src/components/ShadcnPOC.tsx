import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function ShadcnPOC() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          shadcn/ui 概念验证
        </h1>
        <p className="text-muted-foreground">
          测试 shadcn/ui 组件在 Molecule 中的表现
        </p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>按钮组件</CardTitle>
            <CardDescription>
              测试不同类型的按钮样式和交互
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">默认按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="destructive">危险按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
              <Button variant="link">链接按钮</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="default">默认大小</Button>
              <Button size="sm">小按钮</Button>
              <Button size="lg">大按钮</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>表单组件</CardTitle>
            <CardDescription>
              测试输入框和标签组件
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <Input
                id="email"
                type="email"
                placeholder="请输入邮箱地址"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <Button className="w-full">提交表单</Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>主题测试</CardTitle>
          <CardDescription>
            测试深色/浅色主题下的组件表现
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-background border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">背景色</h3>
              <p className="text-muted-foreground">background 变量</p>
            </div>
            <div className="p-4 bg-card border rounded-lg">
              <h3 className="font-semibold text-card-foreground mb-2">卡片色</h3>
              <p className="text-muted-foreground">card 变量</p>
            </div>
            <div className="p-4 bg-muted border rounded-lg">
              <h3 className="font-semibold text-muted-foreground mb-2">静音色</h3>
              <p className="text-muted-foreground">muted 变量</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button 
          onClick={() => console.log('shadcn/ui 概念验证组件正常工作！')}
          size="lg"
        >
          测试交互
        </Button>
      </div>
    </div>
  );
}
