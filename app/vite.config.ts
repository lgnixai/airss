import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';
import mockDevServerPlugin from 'vite-plugin-mock-dev-server';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

import { esbuildPluginMonacoEditorNls } from './plugin';

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    plugins: [
        react({
            jsxRuntime: 'automatic',
            // 启用 React 18 的新特性
            fastRefresh: true,
        }),
        monacoEditorPlugin({
            forceBuildCDN: false,
            languageWorkers: ['editorWorkerService'],
        }),
        mockDevServerPlugin({
            include: 'app/mock/**/*.mock.{ts,js,cjs,mjs,json,json5}',
        }),
    ],
    optimizeDeps: {
        force: true,
        esbuildOptions: {
            plugins: [esbuildPluginMonacoEditorNls()],
        },
        // 预构建优化
        include: ['react', 'react-dom', 'monaco-editor'],
    },
    build: {
        // 构建优化
        target: 'es2022',
        minify: 'esbuild',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'monaco-vendor': ['monaco-editor'],
                },
            },
        },
    },
    server: {
        cors: false,
        proxy: {
            '^/api': {
                target: '',
            },
        },
        // 开发服务器优化
        hmr: {
            overlay: true,
        },
    },
    // 性能优化
    esbuild: {
        target: 'es2022',
    },
});
