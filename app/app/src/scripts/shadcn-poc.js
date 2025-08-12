const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function setupShadcnPOC() {
    console.log('🚀 开始 shadcn/ui 概念验证...\n');
    
    const appDir = path.join(__dirname, '../../../');
    
    try {
        // 1. 安装 Tailwind CSS
        console.log('📦 1. 安装 Tailwind CSS...');
        execSync('pnpm add -D tailwindcss postcss autoprefixer', { 
            cwd: appDir, 
            stdio: 'inherit' 
        });
        
        // 2. 初始化 Tailwind CSS
        console.log('\n⚙️ 2. 初始化 Tailwind CSS...');
        execSync('npx tailwindcss init -p', { 
            cwd: appDir, 
            stdio: 'inherit' 
        });
        
        // 3. 配置 Tailwind CSS
        console.log('\n🔧 3. 配置 Tailwind CSS...');
        const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}`;
        
        fs.writeFileSync(path.join(appDir, 'tailwind.config.js'), tailwindConfig);
        
        // 4. 安装 shadcn/ui CLI
        console.log('\n📦 4. 安装 shadcn/ui CLI...');
        execSync('pnpm add -D @shadcn/ui', { 
            cwd: appDir, 
            stdio: 'inherit' 
        });
        
        // 5. 初始化 shadcn/ui
        console.log('\n⚙️ 5. 初始化 shadcn/ui...');
        execSync('npx shadcn@latest init --yes', { 
            cwd: appDir, 
            stdio: 'inherit' 
        });
        
        // 6. 安装基础组件
        console.log('\n📦 6. 安装基础组件...');
        const components = ['button', 'card', 'input', 'label', 'separator'];
        for (const component of components) {
            try {
                execSync(`npx shadcn@latest add ${component} --yes`, { 
                    cwd: appDir, 
                    stdio: 'inherit' 
                });
                console.log(`✅ 已安装组件: ${component}`);
            } catch (error) {
                console.log(`⚠️ 安装组件 ${component} 失败: ${error.message}`);
            }
        }
        
        // 7. 创建概念验证组件
        console.log('\n🔧 7. 创建概念验证组件...');
        createPOCComponent(appDir);
        
        // 8. 更新 CSS
        console.log('\n🎨 8. 更新 CSS 样式...');
        updateCSS(appDir);
        
        console.log('\n🎉 shadcn/ui 概念验证设置完成！');
        console.log('\n📋 下一步:');
        console.log('1. 启动开发服务器: pnpm run dev');
        console.log('2. 查看概念验证组件效果');
        console.log('3. 评估性能和开发体验');
        
    } catch (error) {
        console.error('❌ 设置失败:', error.message);
    }
}

function createPOCComponent(appDir) {
    const pocComponentPath = path.join(appDir, 'src/components/ShadcnPOC.tsx');
    const pocComponent = `import React from 'react';
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
`;
    
    // 确保目录存在
    const dir = path.dirname(pocComponentPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(pocComponentPath, pocComponent);
    console.log('✅ 概念验证组件已创建: src/components/ShadcnPOC.tsx');
}

function updateCSS(appDir) {
    const cssPath = path.join(appDir, 'src/index.css');
    const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;
    
    fs.writeFileSync(cssPath, cssContent);
    console.log('✅ CSS 样式已更新: src/index.css');
}

// 运行设置
if (require.main === module) {
    setupShadcnPOC();
}

module.exports = { setupShadcnPOC };
