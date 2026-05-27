---
name: bug-fix
description: Bug 修复工作流。输入 /bug-fix 描述 来触发。自动定位问题、评估影响范围、最小化修复。
arguments:
  - description
allowed-tools: Agent(frontend, review, knowledge), Read, Edit, Write, Bash, Grep, Glob
---

## Bug 修复: $description

## 步骤

### 1. 知识库检索
使用 knowledge Agent 搜索 docs/knowledge/，重点用错误信息中的关键词定位代码位置。

### 2. 复杂度评估

| 级别 | 判断标准 | 流程 |
|---|---|---|
| 高 | 核心页面崩溃 / 数据流问题 / 涉及多个模块 | 完整 Spec → 评审确认 → 修复 |
| 中 | 单页面功能异常 / 2-4 文件 | 简要方案（3-5 行）→ 确认 → 修复 |
| 低 | UI 样式问题 / 文案错误 / 单文件 | 直接修复 |

### 3. Spec 输出（高复杂度）
输出到 `docs/specs/YYYY-MM-DD-fix-<name>-spec.md`，包含：问题定位、根因分析、修复方案、回归验证点。

### 4. 修复
- 最小化修复原则：只改必须改的代码，不顺手重构
- 复杂计算逻辑从组件中抽出

### 5. 回归验证
- 确认修复后原问题不再出现
- 检查修复是否引入新问题（相关功能手动验证）

### 6. 验证
- 运行 npm run lint
- review Agent 审查变更

### 7. 提交
- fix(scope): description
