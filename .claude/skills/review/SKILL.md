---
name: review
description: 双层代码审查。输入 /review 来审查当前变更。先走内置 /code-review，再叠加项目规约检查。只读，不修改代码。
allowed-tools: Agent(review), Read, Grep, Glob, Bash, Skill
disallowedTools: Edit, Write
---

## 双层代码审查

### 第一层：内置 /code-review
1. 运行 `git diff` 查看当前变更
2. 使用内置 `/code-review` Skill 进行通用质量审查
3. 覆盖：代码质量、安全漏洞、重复代码、性能、最佳实践

### 第二层：项目规约审查
基于 CLAUDE.md 和知识库，检查：
- 分层合规（domain 不 import React，page 不直接 fetch）
- 目录结构合规（domain/page/style 三分层）
- 命名合规（组件 PascalCase 名词，方法动词组，hook use 前缀）
- API 调用是否通过 domain Service 层
- 是否有 TODO/FIXME/HACK 未完成标记
- 是否有硬编码 mock 替代真实 API
- Spec 要求的每个功能点是否都有实现

### 使用建议
- 低复杂度任务：只跑第一层 `/code-review`
- 高/中复杂度任务：两层都跑

### 输出格式
- 🔴 Critical（阻塞合并）
- 🟡 Warning（建议修复）
- 🔵 Suggestion（改进建议）

每条包含：文件路径、问题描述、修复建议。
