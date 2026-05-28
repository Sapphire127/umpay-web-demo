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

---

## ADR-007: 技术栈选型补充

**日期**: 2026-05-27

**背景**: 初始技术栈定义较简略，参照 AskToken 后台项目的实际技术栈进行补充。数据展示后台的核心场景需要图表、高级表格、完善的测试体系和 API mock 能力。

**决策**:
- HTTP 客户端选用 **Axios**（而非 fetch）：统一的拦截器机制管理 token 注入和错误处理，配合 `domain/shared/request.ts`
- 日期处理选用 **Day.js**：Ant Design 5 内置依赖，体积小
- 图表选用 **Recharts**：React 生态最主流的图表库
- 高级表格选用 **@ant-design/pro-components**：ProTable 一行代码搞定搜索+表格+分页
- 测试选用 **Vitest + @testing-library/react + jest-dom + jsdom**：与 Vite 原生集成的测试方案
- API Mock 选用 **MSW**：Service Worker 级别 mock，不影响代码结构；后端未就绪时按 API 契约 mock
- 覆盖率选用 **@vitest/coverage-v8**

**后果**:
- 正面：覆盖了数据展示后台的全部核心场景（表格、图表、测试、mock）
- 正面：MSW 使契约式开发成为可能——前端按 API 契约写 Service，后端未就绪时用 MSW mock
- 负面：依赖数量增加，后续需关注 bundle size

---

## ADR-008: 数据展示字体选择 Cascadia Code

**日期**: 2026-05-27

**背景**: 数据展示后台的核心场景（表格金额、统计数据、代码/ID 字段）需要等宽字体以确保数字垂直对齐，提升可读性。直接沿用系统默认字体无法保证等宽效果。

**决策**: 数据展示使用 **Cascadia Code**（Cursor 编辑器默认字体）。

**后果**:
- 正面：等宽 + tabular figures 保证数字列垂直对齐；连字 (ligatures) 可选开启
- 正面：开源字体，可自由分发
- 负面：字体文件约 200KB，首次加载有额外开销；Google Fonts 不托管，需自托管或使用 CDN

---

## ADR-009: JWT 单 Token 模式，明文存储于 localStorage

**日期**: 2026-05-27

**背景**: 后端 `POST /api/v1/admin/auth/login` 返回 `accessToken`（2 小时过期），不返回 refreshToken，也无 `/auth/refresh` 端点。JwtTokenProvider 内部有 `generateRefreshToken()` 方法但未通过 API 暴露。Token 过期后需重新登录。

**决策**: 前端使用单 token 模式——登录后 `localStorage.setItem('token', accessToken)` 明文存储，`request.ts` 拦截器读出并附加 `Authorization: Bearer <token>` header。Zustand persist 中间件额外持久化 token 到 `auth-store` key 供 AuthGuard 通过 store 内存读取（避免 localStorage 异步写入时序问题）。logout 时 `localStorage.removeItem('token')`。

**后果**:
- 正面：与后端单 token 模式对齐，无需实现 refresh 逻辑；实现简单
- 正面：token 通过 request 拦截器自动注入，组件层无感
- 负面：明文存储 JWT，存在 XSS 风险。内部管理后台可接受。2 小时过期后用户需重新登录，频繁使用时体验略差

---

## ADR-010: i18n 默认语言为英文

**日期**: 2026-05-27

**背景**: 跨境支付平台面向多个新兴市场（印度、孟加拉、埃及、俄罗斯），运营团队和商户（CP）的通用语言是英语。中文仅作为辅助语言。

**决策**: `fallbackLng` 设为 `en-US`，浏览器语言未匹配时的回退语言为英文。

**后果**:
- 正面：默认英文与跨境业务场景一致，海外商户（CP）使用无障碍
- 负面：中国管理员首次访问时需手动切换为中文，后续由 localStorage 记录偏好
