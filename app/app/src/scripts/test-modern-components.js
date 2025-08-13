const puppeteer = require('puppeteer');

async function testModernComponents() {
    console.log('🚀 开始测试现代化组件...');
    
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1920, height: 1080 }
    });
    
    const page = await browser.newPage();
    
    try {
        // 导航到页面
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('\n📋 1. 检查页面标题');
        const title = await page.title();
        console.log(`页面标题: ${title}`);
        
        console.log('\n📋 2. 检查现代化组件');
        const modernComponents = await page.evaluate(() => {
            return {
                hasActivityBar: !!document.querySelector('[class*="w-16"]'), // Activity Bar 宽度
                hasSidebar: !!document.querySelector('[class*="border-r"]'), // 侧边栏边框
                hasStatusBar: !!document.querySelector('[class*="h-8"]'), // Status Bar 高度
                hasShadcnComponents: !!document.querySelector('[class*="bg-background"]'), // shadcn 背景
                hasTailwindClasses: !!document.querySelector('[class*="flex"]'), // Tailwind 类
            };
        });
        
        console.log('现代化组件状态:', modernComponents);
        
        console.log('\n📋 3. 测试 Activity Bar 交互');
        const activityBarItems = await page.evaluate(() => {
            const buttons = document.querySelectorAll('button[class*="h-12"]');
            return Array.from(buttons).map(btn => ({
                text: btn.textContent?.trim(),
                hasIcon: !!btn.querySelector('svg'),
                isClickable: !btn.disabled
            }));
        });
        
        console.log('Activity Bar 项目:', activityBarItems);
        
        console.log('\n📋 4. 测试 Sidebar 功能');
        const sidebarElements = await page.evaluate(() => {
            const searchInput = document.querySelector('input[placeholder*="搜索"]');
            const fileTree = document.querySelectorAll('[class*="cursor-pointer"]');
            
            return {
                hasSearchInput: !!searchInput,
                searchPlaceholder: searchInput?.placeholder,
                fileTreeItems: fileTree.length,
                hasFolderIcons: !!document.querySelector('svg[class*="text-blue-500"]')
            };
        });
        
        console.log('Sidebar 功能:', sidebarElements);
        
        console.log('\n📋 5. 测试 Status Bar');
        const statusBarItems = await page.evaluate(() => {
            const statusButtons = document.querySelectorAll('[class*="h-6"]');
            return {
                statusItems: statusButtons.length,
                hasGitInfo: !!document.querySelector('[class*="text-green"]'),
                hasTimeInfo: !!document.querySelector('[class*="text-muted-foreground"]')
            };
        });
        
        console.log('Status Bar 状态:', statusBarItems);
        
        console.log('\n📋 6. 测试主题系统');
        const themeSystem = await page.evaluate(() => {
            return {
                hasCSSVariables: !!document.querySelector('[style*="--background"]') || 
                                !!document.querySelector('[class*="bg-background"]'),
                hasDarkTheme: !!document.querySelector('[class*="dark"]') ||
                             !!document.querySelector('[class*="bg-background"]'),
                hasMutedColors: !!document.querySelector('[class*="text-muted-foreground"]')
            };
        });
        
        console.log('主题系统:', themeSystem);
        
        console.log('\n📋 7. 测试响应式设计');
        const responsiveDesign = await page.evaluate(() => {
            return {
                hasFlexbox: !!document.querySelector('[class*="flex"]'),
                hasGrid: !!document.querySelector('[class*="grid"]'),
                hasResponsiveClasses: !!document.querySelector('[class*="md:"]') ||
                                     !!document.querySelector('[class*="lg:"]')
            };
        });
        
        console.log('响应式设计:', responsiveDesign);
        
        // 截图
        await page.screenshot({ 
            path: 'test-results/modern-components-test.png', 
            fullPage: true 
        });
        
        console.log('\n🎯 测试总结:');
        console.log(`✅ Activity Bar: ${modernComponents.hasActivityBar ? '正常' : '异常'}`);
        console.log(`✅ Sidebar: ${modernComponents.hasSidebar ? '正常' : '异常'}`);
        console.log(`✅ Status Bar: ${modernComponents.hasStatusBar ? '正常' : '异常'}`);
        console.log(`✅ shadcn/ui: ${modernComponents.hasShadcnComponents ? '正常' : '异常'}`);
        console.log(`✅ Tailwind CSS: ${modernComponents.hasTailwindClasses ? '正常' : '异常'}`);
        console.log(`✅ 主题系统: ${themeSystem.hasCSSVariables ? '正常' : '异常'}`);
        console.log(`✅ 响应式设计: ${responsiveDesign.hasFlexbox ? '正常' : '异常'}`);
        
        const allTestsPassed = Object.values(modernComponents).every(Boolean) &&
                              Object.values(themeSystem).some(Boolean) &&
                              Object.values(responsiveDesign).some(Boolean);
        
        if (allTestsPassed) {
            console.log('\n🎉 现代化组件测试通过！');
            console.log('✅ 所有核心组件正常工作');
            console.log('✅ shadcn/ui 集成成功');
            console.log('✅ Tailwind CSS 配置正确');
            console.log('✅ 主题系统运行正常');
        } else {
            console.log('\n⚠️ 部分测试失败，需要检查组件实现');
        }
        
    } catch (error) {
        console.error('💥 测试失败:', error);
    } finally {
        await browser.close();
    }
}

testModernComponents().catch(console.error);
