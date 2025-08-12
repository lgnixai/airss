import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

// 引入测试日志收集器
import './tests/logger';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
