---
name: spec
description: 手动触发 Spec 生成。输入 /spec 描述 来对任意任务生成计划文档。强制 Plan 模式，只输出计划不修改代码。
arguments:
  - description
allowed-tools: Agent(knowledge), Read, Grep, Glob, Bash, Write
permissionMode: plan
---

## Spec 生成: $description

Plan 模式，只输出计划文档，不修改代码。

## 步骤

### 1. 知识库检索
使用 knowledge Agent 检索 docs/knowledge/，获取相关上下文。

### 2. 分析
- 影响范围分析
- 涉及的页面和领域模块
- 相关 API 契约
- 依赖关系

### 3. 输出 Spec 文档
保存到 `docs/specs/YYYY-MM-DD-<name>-spec.md`：

```
# [名称] Spec

## 概述
一句话描述目标。

## 影响分析
- 涉及页面：[列表]
- 涉及领域模块：[列表]
- 关键文件：[路径]
- 依赖关系：[上下游]

## API 契约
- 相关接口及请求/响应格式

## 实现细节
按 domain → page 顺序列出每个文件的改动和验收标准。

## 验收标准
- [ ] 功能正确性
- [ ] lint 通过
- [ ] Review 通过
```

### 4. 等待确认
- 输出 Spec 后等待用户确认
- 用户确认后切换到执行模式进行开发
