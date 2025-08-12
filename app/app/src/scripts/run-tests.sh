#!/bin/bash

echo "🤖 Molecule 自动化测试工具"
echo "=========================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在 app 目录下运行此脚本"
    exit 1
fi

# 检查应用是否运行
echo "🔍 检查应用状态..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ 应用正在运行"
else
    echo "❌ 应用未运行，正在启动..."
    echo "📝 请在新终端中运行: pnpm dev"
    echo "⏳ 等待应用启动..."
    
    # 等待应用启动
    for i in {1..30}; do
        if curl -s http://localhost:5173 > /dev/null; then
            echo "✅ 应用已启动"
            break
        fi
        echo "⏳ 等待中... ($i/30)"
        sleep 2
    done
    
    if ! curl -s http://localhost:5173 > /dev/null; then
        echo "❌ 应用启动超时，请手动启动后重试"
        exit 1
    fi
fi

echo ""
echo "🚀 开始自动化测试..."
echo ""

# 运行测试
pnpm test:automation

echo ""
echo "✅ 测试完成！"

