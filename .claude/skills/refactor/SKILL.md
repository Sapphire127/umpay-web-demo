---
name: refactor
description: 代码重构工作流。输入 /refactor 描述 来触发。分析依赖链、小步重构、确保不破坏现有功能。
arguments:
  - description
allowed-tools: Agent(frontend, review, knowledge), Read, Edit, Write, Bash, Grep, Glob
---

## 代码重构: $description

## 步骤

### 1. 知识库检索
使用 knowledge Agent 搜索 docs/knowledge/，重点是依赖链分析——grep 所有引用被重构代码的位置，列出受影响文件。

### 2. 复杂度评估

| 级别 | 判断标准 | 流程 |
|---|---|---|
| 高 | 架构级 / 跨 ≥3 模块 / 影响 ≥10 文件 | 完整 Spec → 评审确认 → 执行 |
| 中 | 模块内重构 / 3-9 文件 | 简要方案（3-5 行）→ 确认 → 执行 |
| 低 | 提取工具函数 / 重命名 / 1-2 文件 | 直接执行 |

### 3. Spec 输出（高复杂度）
输出到 `docs/specs/YYYY-MM-DD-refactor-<name>-spec.md`，包含：影响范围、依赖链、重构步骤、每步验证方法、风险点。

### 4. 执行
- 小步重构原则：每步可验证，每步跑 lint
- 先确保现有代码能通过 lint，再开始重构
- 每步重构后确认 lint 通过
- 更新受影响的调用方

### 5. 验证
- 运行 npm run lint
- review Agent 审查变更
- 确认无功能退化

### 6. 知识库更新
- 如有结构性变更（目录变化、模块关系变化），更新 docs/knowledge/
- 如有架构级决策（技术选型、分层变更、模式选择），直接记录到 docs/knowledge/decisions.md，按 ADR 格式追加（日期、背景、决策、后果）

### 7. 提交
- refactor(scope): description
