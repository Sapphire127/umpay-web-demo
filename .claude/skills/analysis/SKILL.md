---
name: analysis
description: 分析调研工作流。输入 /analysis 描述 来触发。检索知识库和代码，输出分析报告，不修改代码。
arguments:
  - description
allowed-tools: Agent(knowledge), Read, Grep, Glob, Bash
disallowedTools: Edit, Write
---

## 分析调研: $description

只读操作，不修改任何代码。

## 步骤

### 1. 知识库检索
使用 knowledge Agent 搜索 docs/knowledge/ 和项目代码，获取相关上下文。

### 2. 分析
- 搜索相关代码（Grep/Glob）
- 追踪依赖链
- 识别受影响的 API 和页面
- 检查相关的架构决策

### 3. 输出报告
```
## 分析报告: $description

### 背景
[分析的原因和上下文]

### 现状
[当前实现情况]

### 影响范围
- 涉及页面: [列表]
- 涉及领域模块: [列表]
- 依赖链: [上下游关系]

### 关键发现
[分析结果]

### 建议
[实施建议]
```

### 4. 不提交代码
分析任务不产生代码变更。
