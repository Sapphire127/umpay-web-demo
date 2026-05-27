# 架构决策记录 (ADR)

## ADR-001: 选择 React + Vite 而非 Next.js

**日期**: 2026-05-27

**背景**: 项目是数据展示后台前端，后端 API 已独立存在，前后端分离。Next.js 的核心优势（SSR、Server Components、API Routes）在前后端分离场景下均为冗余能力。

**决策**: 使用 React 18 + Vite 构建纯 SPA。

**后果**:
- 正面：AI 编码输出更稳定（React API 面小、训练数据充足）；编译更快（Vite HMR）；部署简单（静态文件）
- 负面：需手写 react-router 路由配置；无文件路由系统

---

## ADR-002: 采用 domain/page 分层架构

**日期**: 2026-05-27

**背景**: 需要明确的关注点分离——业务逻辑不应与 UI 组件耦合。

**决策**: 采用 DDD 风格两层架构：
- `domain/` — 纯 TypeScript，不依赖 React。放业务类型、计算逻辑、API Service
- `page/` — React 组件 + 样式 + 私有 hook。通过 domain Service 获取数据
- `style/` — 全局样式，与 domain/page 同级

**后果**:
- 正面：domain 层可独立测试；page 层不直接操作 HTTP；职责边界清晰
- 负面：简单功能也需跨越两层，有一定模板成本

---

## ADR-003: 选择 Zustand 管理全局状态

**日期**: 2026-05-27

**背景**: 需要全局状态管理（主题偏好、用户信息等），但不希望引入 Redux 的模板复杂度。

**决策**: 使用 Zustand，配合 `persist` 中间件持久化到 localStorage。

**后果**:
- 正面：API 极小（一个 `create` 函数）；天然支持 TypeScript；无 Provider 包裹；内置持久化
- 负面：大型项目下 devtools 生态不如 Redux 成熟

---

## ADR-004: 主题切换采用 CSS 变量 + html[data-theme]

**日期**: 2026-05-27

**背景**: 后台面板需要支持亮色/暗色模式切换，后续可能扩展多套品牌色。

**决策**:
- CSS 层：`style/theme.scss` 定义 CSS 自定义属性，`:root` 为亮色，`[data-theme="dark"]` 为暗色
- React 层：Ant Design `ConfigProvider theme.algorithm` 控制组件主题
- 状态层：Zustand store 管理 `data-theme` 属性 + localStorage 持久化

**后果**:
- 正面：CSS 变量和 Ant Design 互不冲突；后续加 `[data-theme="sunset"]` 只需加一段 CSS
- 负面：需同时维护 CSS 变量和 Ant Design token 两套变量体系

---

## ADR-005: 组件样式采用根类名作用域隔离

**日期**: 2026-05-27

**背景**: 需要避免样式污染，但不希望引入 CSS Modules 或 styled-components 的额外构建配置。

**决策**: 每个组件一个同名 `.scss`，用组件根类名包裹所有子样式做作用域隔离。不采用 BEM 命名拆平。

**后果**:
- 正面：简单直观，无额外依赖；与全局 class 协作自然
- 负面：依赖命名纪律，没有编译期强制隔离

---

## ADR-006: 单 Agent 架构，不启用 Agent Team

**日期**: 2026-05-27

**背景**: 项目为纯前端，所有开发工作由 frontend Agent 完成。Playbook 推荐的 Agent Team 模式面向跨层（后端+前端+测试）协作场景。

**决策**: 只配置 frontend、review、knowledge 三个 Agent，不配置 Coordinator、Backend、Test Agent。不启用 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`。

**后果**:
- 正面：配置简洁；无协调开销；用户直接通过 Skill 驱动流程
- 负面：如果后续引入后端 Agent，需重新评估 Agent 架构
