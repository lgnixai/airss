const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class UpgradeVerificationTest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.testResults = {
            startTime: new Date(),
            tests: [],
            summary: {
                total: 0,
                passed: 0,
                failed: 0,
                errors: []
            }
        };
    }

    async init() {
        console.log('🚀 启动升级验证测试...');
        this.browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        
        // 设置页面超时
        this.page.setDefaultTimeout(30000);
        this.page.setDefaultNavigationTimeout(30000);
    }

    async runTest(testName, testFunction) {
        this.testResults.summary.total++;
        console.log(`\n📋 运行测试: ${testName}`);
        
        try {
            const result = await testFunction();
            if (result) {
                this.testResults.summary.passed++;
                this.testResults.tests.push({
                    name: testName,
                    status: 'PASSED',
                    message: '测试通过'
                });
                console.log(`✅ ${testName}: 通过`);
            } else {
                this.testResults.summary.failed++;
                this.testResults.tests.push({
                    name: testName,
                    status: 'FAILED',
                    message: '测试失败'
                });
                console.log(`❌ ${testName}: 失败`);
            }
        } catch (error) {
            this.testResults.summary.failed++;
            this.testResults.summary.errors.push({
                test: testName,
                error: error.message
            });
            this.testResults.tests.push({
                name: testName,
                status: 'ERROR',
                message: error.message
            });
            console.log(`💥 ${testName}: 错误 - ${error.message}`);
        }
    }

    async testServerConnection() {
        try {
            await this.page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
            const title = await this.page.title();
            return title.includes('Molecule') || title.includes('Vite');
        } catch (error) {
            throw new Error(`服务器连接失败: ${error.message}`);
        }
    }

    async testReact18Features() {
        try {
            // 检查 React 18 的 createRoot API
            const hasCreateRoot = await this.page.evaluate(() => {
                return typeof window.ReactDOM?.createRoot === 'function';
            });
            
            // 检查 React 18 的并发特性
            const hasConcurrentFeatures = await this.page.evaluate(() => {
                return typeof window.React?.startTransition === 'function';
            });
            
            return hasCreateRoot && hasConcurrentFeatures;
        } catch (error) {
            throw new Error(`React 18 特性检查失败: ${error.message}`);
        }
    }

    async testTypeScriptCompilation() {
        try {
            // 检查是否有 TypeScript 编译错误
            const consoleErrors = await this.page.evaluate(() => {
                return window.consoleErrors || [];
            });
            
            const tsErrors = consoleErrors.filter(error => 
                error.includes('TypeScript') || 
                error.includes('TS') ||
                error.includes('type')
            );
            
            return tsErrors.length === 0;
        } catch (error) {
            throw new Error(`TypeScript 编译检查失败: ${error.message}`);
        }
    }

    async testViteFeatures() {
        try {
            // 检查 Vite 热重载功能
            const hasViteHMR = await this.page.evaluate(() => {
                return typeof window.__VITE_HMR_RUNTIME__ !== 'undefined';
            });
            
            // 检查 Vite 开发服务器
            const hasViteDevServer = await this.page.evaluate(() => {
                return window.location.port === '5173';
            });
            
            return hasViteHMR && hasViteDevServer;
        } catch (error) {
            throw new Error(`Vite 功能检查失败: ${error.message}`);
        }
    }

    async testMonacoEditor() {
        try {
            // 等待 Monaco Editor 加载
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // 检查 Monaco Editor 是否正常工作
            const monacoStatus = await this.page.evaluate(() => {
                return new Promise((resolve) => {
                    if (window.monaco) {
                        resolve({
                            loaded: true,
                            version: window.monaco.version,
                            languages: Object.keys(window.monaco.languages.getLanguages())
                        });
                    } else {
                        resolve({ loaded: false });
                    }
                });
            });
            
            return monacoStatus.loaded && monacoStatus.languages.length > 0;
        } catch (error) {
            throw new Error(`Monaco Editor 检查失败: ${error.message}`);
        }
    }

    async testMoleculeCore() {
        try {
            // 检查 Molecule 核心组件
            const moleculeComponents = await this.page.evaluate(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const components = {
                            activityBar: !!document.querySelector('[data-testid="activityBar"]') || 
                                       !!document.querySelector('.activityBar') ||
                                       !!document.querySelector('[class*="activity"]'),
                            sidebar: !!document.querySelector('[data-testid="sidebar"]') ||
                                   !!document.querySelector('.sidebar') ||
                                   !!document.querySelector('[class*="sidebar"]'),
                            editor: !!document.querySelector('[data-testid="editor"]') ||
                                  !!document.querySelector('.editor') ||
                                  !!document.querySelector('[class*="editor"]'),
                            statusBar: !!document.querySelector('[data-testid="statusBar"]') ||
                                     !!document.querySelector('.statusBar') ||
                                     !!document.querySelector('[class*="status"]')
                        };
                        resolve(components);
                    }, 2000);
                });
            });
            
            return Object.values(moleculeComponents).some(Boolean);
        } catch (error) {
            throw new Error(`Molecule 核心组件检查失败: ${error.message}`);
        }
    }

    async testPluginSystem() {
        try {
            // 检查插件系统是否正常工作
            const pluginSystemStatus = await this.page.evaluate(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        // 检查控制台日志中是否有插件相关消息
                        const logs = window.consoleLogs || [];
                        const pluginLogs = logs.filter(log => 
                            log.includes('Plugin') || 
                            log.includes('plugin') ||
                            log.includes('Extension')
                        );
                        
                        resolve({
                            hasPluginLogs: pluginLogs.length > 0,
                            pluginCount: pluginLogs.length
                        });
                    }, 3000);
                });
            });
            
            return pluginSystemStatus.hasPluginLogs;
        } catch (error) {
            throw new Error(`插件系统检查失败: ${error.message}`);
        }
    }

    async testPerformance() {
        try {
            // 检查页面加载性能
            const performanceMetrics = await this.page.evaluate(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const metrics = {
                            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                            firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
                            firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
                        };
                        resolve(metrics);
                    }, 1000);
                });
            });
            
            // 性能基准：加载时间 < 5秒
            return performanceMetrics.loadTime < 5000;
        } catch (error) {
            throw new Error(`性能检查失败: ${error.message}`);
        }
    }

    async testBuildOutput() {
        try {
            // 检查构建输出文件
            const distPath = path.join(__dirname, '../../../dist');
            const hasDistFolder = fs.existsSync(distPath);
            
            if (!hasDistFolder) {
                throw new Error('构建输出目录不存在');
            }
            
            // 检查主要文件
            const requiredFiles = [
                'index.html',
                'assets/index.js',
                'assets/index.css'
            ];
            
            const missingFiles = requiredFiles.filter(file => 
                !fs.existsSync(path.join(distPath, file))
            );
            
            return missingFiles.length === 0;
        } catch (error) {
            throw new Error(`构建输出检查失败: ${error.message}`);
        }
    }

    async captureScreenshot() {
        try {
            const screenshotPath = path.join(__dirname, '../../../test-results/upgrade-verification.png');
            await this.page.screenshot({ 
                path: screenshotPath, 
                fullPage: true 
            });
            console.log(`📸 截图已保存: ${screenshotPath}`);
        } catch (error) {
            console.log(`⚠️ 截图失败: ${error.message}`);
        }
    }

    async generateReport() {
        const reportPath = path.join(__dirname, '../../../test-results/upgrade-verification-report.json');
        const report = {
            ...this.testResults,
            endTime: new Date(),
            duration: new Date() - this.testResults.startTime,
            summary: {
                ...this.testResults.summary,
                successRate: (this.testResults.summary.passed / this.testResults.summary.total * 100).toFixed(2) + '%'
            }
        };
        
        // 确保目录存在
        const dir = path.dirname(reportPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📊 测试报告已保存: ${reportPath}`);
        
        return report;
    }

    async run() {
        try {
            await this.init();
            
            // 设置控制台日志监听
            await this.page.evaluateOnNewDocument(() => {
                window.consoleLogs = [];
                window.consoleErrors = [];
                
                const originalLog = console.log;
                const originalError = console.error;
                
                console.log = (...args) => {
                    window.consoleLogs.push(args.join(' '));
                    originalLog.apply(console, args);
                };
                
                console.error = (...args) => {
                    window.consoleErrors.push(args.join(' '));
                    originalError.apply(console, args);
                };
            });
            
            // 运行所有测试
            await this.runTest('服务器连接测试', () => this.testServerConnection());
            await this.runTest('React 18 特性测试', () => this.testReact18Features());
            await this.runTest('TypeScript 编译测试', () => this.testTypeScriptCompilation());
            await this.runTest('Vite 功能测试', () => this.testViteFeatures());
            await this.runTest('Monaco Editor 测试', () => this.testMonacoEditor());
            await this.runTest('Molecule 核心组件测试', () => this.testMoleculeCore());
            await this.runTest('插件系统测试', () => this.testPluginSystem());
            await this.runTest('性能测试', () => this.testPerformance());
            await this.runTest('构建输出测试', () => this.testBuildOutput());
            
            // 截图
            await this.captureScreenshot();
            
            // 生成报告
            const report = await this.generateReport();
            
            // 输出总结
            console.log('\n🎯 测试总结:');
            console.log(`总测试数: ${report.summary.total}`);
            console.log(`通过: ${report.summary.passed}`);
            console.log(`失败: ${report.summary.failed}`);
            console.log(`成功率: ${report.summary.successRate}`);
            console.log(`总耗时: ${(report.duration / 1000).toFixed(2)}秒`);
            
            if (report.summary.failed > 0) {
                console.log('\n❌ 失败的测试:');
                report.tests.filter(test => test.status !== 'PASSED').forEach(test => {
                    console.log(`  - ${test.name}: ${test.message}`);
                });
            }
            
            return report.summary.failed === 0;
            
        } catch (error) {
            console.error('💥 测试运行失败:', error);
            return false;
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }
}

// 运行测试
async function main() {
    const test = new UpgradeVerificationTest();
    const success = await test.run();
    
    if (success) {
        console.log('\n🎉 所有测试通过！升级验证成功！');
        process.exit(0);
    } else {
        console.log('\n⚠️ 部分测试失败，请检查升级结果。');
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = UpgradeVerificationTest;
