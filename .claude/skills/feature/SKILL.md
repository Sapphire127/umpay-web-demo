---
name: feature
description: 新功能开发工作流。输入 /feature 描述 来触发。自动检索知识库、评估复杂度、按 domain→page 顺序开发。
arguments:
  - description
allowed-tools: Agent(frontend, review, knowledge), Read, Edit, Write, Bash, Grep, Glob
---

## 新功能开发: $description

## 步骤

### 1. 知识库检索
使用 knowledge Agent 检索 docs/knowledge/，获取涉及的模块和 API 契约。

### 2. 复杂度评估

| 级别 | 判断标准 | 流程 |
|---|---|---|
| 高 | 跨多个模块 + ≥5 文件 | 完整 Spec → 评审确认 → 开发 |
| 中 | 单页面新功能 / 2-4 文件 | 简要方案（3-5 行）→ 确认 → 开发 |
| 低 | 样式调整 / 文案修改 / 单文件 | 直接开发 |

### 3. Spec 输出（高复杂度）

输出完整 Spec 文档到 `docs/specs/YYYY-MM-DD-<name>-spec.md`，包含：

```
# [Feature 名称] Spec

## 概述
一句话描述目标。

## 影响分析
- 涉及页面：[页面列表]
- 涉及领域模块：[domain 模块列表]
- 关键文件：[文件路径]
- 依赖关系：[上下游依赖]

## API 契约
- GET /api/v1/xxx → 请求/响应格式
- POST /api/v1/xxx → 请求/响应格式

## 实现细节
按 domain → page 顺序列出：
- domain/{module}/{entity}.ts — 类型定义
- domain/{module}/{entity}Service.ts — API 调用
- page/{Module}/{SubPage}/{Component}.tsx — 页面组件
- page/{Module}/{SubPage}/{component}.ts — 辅助方法
- page/{Module}/{SubPage}/{Component}.scss — 样式

每个文件标注验收标准：
- ✅ 好：`创建 PointsService.getBalance() 方法，参数 userId: number，返回 Promise<BalanceVO>`
- ❌ 差：`实现积分功能`

## 验收标准
- [ ] 功能正确性
- [ ] lint 通过
- [ ] Review 通过
```

### 4. Spec 评审（高/中复杂度）
- 输出计划后等待用户确认
- 高复杂度：人工审查 Spec 文档，可修改后确认
- 中复杂度：确认简要方案后进入开发
- 确认后再进入编码阶段，避免方向性返工

### 5. 领域层开发（domain/）
- 类型定义 ({entity}.ts)
- API Service ({entity}Service.ts)

### 6. 页面层开发（page/）
- 组件 + 样式 + 私有 hook 共置在同一目录
- 通过 domain Service 获取数据

### 7. 验证
- 运行 npm run lint
- review Agent 审查变更

### 8. 知识库更新
- 如有结构性变更（新增页面/模块、API 契约变化），更新 docs/knowledge/
- 如有架构级决策（技术选型、分层变更、模式选择），直接记录到 docs/knowledge/decisions.md，按 ADR 格式追加（日期、背景、决策、后果）

### 9. 提交
- feat(scope): description
