// 测试日志收集器
class TestLogger {
  private logs: string[] = [];

  log(message: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    // 使用原始的 console.log 避免无限递归
    originalConsoleLog(logEntry);
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }

  // 检查是否包含特定关键词的日志
  hasLog(keyword: string): boolean {
    return this.logs.some(log => log.toLowerCase().includes(keyword.toLowerCase()));
  }

  // 获取包含特定关键词的日志
  getLogsByKeyword(keyword: string): string[] {
    return this.logs.filter(log => log.toLowerCase().includes(keyword.toLowerCase()));
  }
}

// 保存原始的 console 方法
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// 创建全局日志实例
const testLogger = new TestLogger();

// 重写 console.log 来收集日志
console.log = function(...args) {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
  
  testLogger.log(message);
  originalConsoleLog.apply(console, args);
};

// 重写 console.error 来收集错误日志
console.error = function(...args) {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
  
  testLogger.log(`ERROR: ${message}`);
  originalConsoleError.apply(console, args);
};

// 将日志收集器暴露到全局
(window as any).testLogger = testLogger;
(window as any).testLogs = testLogger.getLogs.bind(testLogger);

// 导出日志收集器
export { testLogger };

