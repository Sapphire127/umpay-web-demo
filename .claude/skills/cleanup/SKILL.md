---
name: cleanup
description: 清理优化工作流。输入 /cleanup 描述 来触发。直接执行，无需 Spec。
arguments:
  - description
allowed-tools: Agent(frontend), Read, Edit, Write, Bash, Grep, Glob
---

## 清理优化: $description

## 步骤

### 1. 理解清理目标
- 确定清理范围和具体内容

### 2. 直接执行
常见场景：
- 删除未使用的 import / 变量 / 函数
- 格式化代码
- 移除死代码
- 统一命名风格
- 更新过时的注释

### 3. 验证
- 运行 npm run lint
- 确认无破坏性变更

### 4. 提交
- chore(scope): description
