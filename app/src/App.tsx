import { useEffect, useRef } from 'react';
import { create } from '@dtinsight/molecule';

// 创建全局实例，避免重复创建
let instance: any = null;

export default function App() {
    const container = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        // 如果实例已存在，先清理
        if (instance) {
            try {
                instance.dispose();
            } catch (e) {
                console.warn('清理旧实例时出错:', e);
            }
        }
        
        // 创建新实例
        instance = create({
            extensions: import('./extensions/TestExtension').then(({ TestExtension }) => [TestExtension]),
            defaultLocale: 'zh-CN',
            defaultColorTheme: 'Default Dark+',
            onigurumPath: '/wasm/onig.wasm',
        });
        
        instance.render(container.current);

        return () => {
            if (instance) {
                try {
                    instance.dispose();
                    instance = null;
                } catch (e) {
                    console.warn('清理实例时出错:', e);
                }
            }
        };
    }, []);
    
    return <div ref={container} />;
}
