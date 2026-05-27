# 项目开发规范

## 项目概述
数据展示后台前端，前后端分离：
- 前端: React 18 + TypeScript + Ant Design + Vite
- 后端: 已有独立 REST API（非本项目负责）
- 知识库位于 docs/knowledge/，开始任何任务前先检索

## 目录结构

```
src/
  main/
    style/                    # 全局样式（与 domain/page 同级）
      index.scss              # 入口：@use 'theme'; @use 'globals';
      theme.scss              # CSS 自定义属性（设计令牌），html[data-theme] 定义
      globals.scss            # 全局 class（.card, .title, .gain, .loss）
    domain/                   # 领域层 —— 纯 TS 业务逻辑，不依赖 React
      {module}/               # 按业务模块分
        {entity}.ts           # 类型定义，名词命名
        {entity}Service.ts    # 业务逻辑 + API 调用
      shared/                 # 跨领域共享基础设施
        request.ts            # HTTP 请求封装
        response.ts           # 响应类型与处理
        dates.ts              # 日期工具
        arrays.ts             # 数组工具
    page/                     # 页面层 —— React 组件 + 样式 + 页面 hook
      {Module}/
        {SubPage}/
          {Component}.tsx     # 组件，PascalCase 名词
          {component}.ts      # 组件的专属辅助方法（同名小写）
          {Component}.scss
          use{Thing}.ts       # 页面私有 hook
        shared/               # 模块内共享：业务 → 展示的翻译层
          {module}Formatter.ts
          {module}Translator.ts
      shared/                 # 跨页面共享：通用 Modal、通用 hook
        DeleteModal.tsx
        useConfirmModal.ts
        numberFormatter.ts
    router.tsx                # react-router 配置
  _tests_/                    # 测试（与 main 镜像结构）
    domain/
    page/
```

## 分层规则

- **style/** — 全局 SCSS，设计令牌（CSS 变量）和全局 class。不包含 React 组件
- **domain/** — 纯 TypeScript，不 import React 任何东西。业务类型、计算逻辑、API Service
- **page/** — React 组件 + 页面级样式 + 页面级 hook。通过 domain Service 获取数据
- **domain/shared/** — 业务无关的基础设施（HTTP 封装、日期、数组）
- **page/shared/** — 跨页面共享的 React 组件、hook、纯 TS 工具（`numberFormatter.ts`）
- **page/{Module}/shared/** — 模块内共享的业务翻译层（`{module}Formatter.ts`、`{module}Translator.ts`）

## 主题系统

- `style/theme.scss` — CSS 自定义属性定义，`html[data-theme]` 选择器切换
  - `:root` → 亮色模式默认值
  - `[data-theme="dark"]` → 暗色模式覆盖
  - 后续可扩展 `[data-theme="sunset"]` 等多套品牌色
- `style/globals.scss` — 全局 class 引用 theme 变量
- Ant Design 组件主题通过 `ConfigProvider` 的 `theme` prop 控制
- 主题状态用 Zustand store 管理，持久化到 localStorage，切换时修改 `document.documentElement` 的 `data-theme` 属性

## 文件组织

- 组件文件共置：`.tsx` + `.scss` + 私有 `.ts`/hook 放在同一页面目录
- 组件同名的小写 `.ts` 文件承载该组件专属的辅助方法（从组件中抽出的纯逻辑）
- 复杂计算逻辑从组件中抽成纯 `.ts` 文件

## 命名规范

| 类别 | 命名方式 | 示例 |
|---|---|---|
| 组件文件 | PascalCase，名词 | `AssetList.tsx` |
| 组件主函数 | 与文件名相同 | `function AssetList() {}` |
| 组件辅助文件 | camelCase，名词（与组件同名小写） | `assetList.ts` |
| 业务方法 | 动词/动名词组 | `getAccount()`, `calculateROI()` |
| 纯逻辑文件 | camelCase，名词 | `trendData.ts`, `numberFormatter.ts` |
| Hook 文件 | use + 名词，camelCase | `useSymbols.ts` |
| 样式文件 | 与组件同名 | `AssetList.scss` |
| 类型定义文件 | 名词 | `trading.ts`, `assets.ts` |

## SCSS 规范

### 全局样式（style/）
- `theme.scss` 定义 CSS 自定义属性（设计令牌），`html[data-theme]` 控制主题切换
- `globals.scss` 定义全局 class（`.card`, `.title`, `.secondaryTitle`, `.gain`, `.loss`, `.disabled`），引用 theme 变量
- `index.scss` 作为入口文件汇总 `@use`
- 全局 class 不依赖具体组件，任何组件可直接使用

### 组件样式（page/）
- 每个组件一个同名 `.scss`，与 `.tsx` 共置
- 组件根类名包裹所有子样式，做作用域隔离：
  ```scss
  .assetList {
      .header { ... }
      .table { ... }
      .ant-table-cell { ... }   // 覆盖组件库也从根类名开始
  }
  ```
- 不采用 BEM 命名拆平
- 覆盖 Ant Design 样式必须从组件根类名开始写嵌套（如 `.assetInput .ant-form-item`），不直接修改全局 Ant Design 样式

## 类型定义规则

- **domain 层的业务类型**：放在对应业务模型的 `.ts` 文件中（如 `trading.ts` 定义 Trading 相关 interface/type）
- **page 层的类型**：单个组件使用的 Props 写在组件文件内；跨组件使用的提取到 `page/{Module}/shared/` 或 `page/shared/`

## 编码规范

### 组件
- 函数组件 + Hooks
- Props 类型显式定义
- 页面级组件包裹 ErrorBoundary

### API 调用
- domain Service 层统一调用 `domain/shared/request.ts`
- page 层通过 Service 获取数据，不在组件中直接写 fetch

### TypeScript
- 禁止 any，确有必要时标注理由
- 接口用 interface，类型别名用 type

## 完成标准

每个任务完成后，必须确认以下内容：
1. 运行 `npm run lint`，确认无错误
2. `git diff` 确认变更覆盖了需求的所有条目
3. 无 TODO/FIXME/HACK 等未完成标记
4. 新增代码符合项目编码规范（分层、命名、目录结构）
- 测试失败或验收标准未满足时，不允许标记完成
- 不允许用简化实现绕过需求（如硬编码 mock 替代真实 API 调用）
- 遇到不确定的实现细节，先查文档再编码，不猜测

## 知识实时性

两级知识体系：
- **第一级**：`docs/knowledge/` 项目知识库 — 每次任务开始前必须检索
- **第二级**：context7 MCP / WebFetch — 框架、库、API 的官方文档

反虚构规则：
- 不确定 API 语法或库用法时，必须查询文档，不靠记忆猜测
- 查询前先读 `package.json` 确认版本号，再查对应版本文档
- 编码前先搜索项目中是否已有类似实现（Grep/Glob），避免重复造轮子
- 不确定配置方式时，先 Read 项目中现有的配置文件，保持一致
- 禁止虚构不存在的 API、方法或配置项
- 知识库中的信息如果与代码实际不符，以代码为准并更新知识库

## 代码设计硬约束

### 关注点分离
- domain 不依赖 React；page 不直接操作 HTTP
- 展示组件只渲染 props，状态管理用 Zustand

### 消除代码重复
- 相同逻辑出现两次 → 提取公共函数
- 相似结构出现三次 → 抽象通用模式
- 不为了消除重复而过早抽象——业务语义不同的相似代码允许保留

### 抽象层次统一
- 一个函数内的所有操作在同一抽象层次
- 命名反映抽象层次：高层用业务动词，低层用具体名词

## 执行准则

1. **先想后写** — 动手前声明假设；不隐藏困惑；多种解释时列出来问清楚
2. **简单至上** — 写最少代码；不加需求外的功能；不写推测性代码
3. **外科手术式修改** — 只碰必须改的代码，匹配现有风格；不顺路优化
4. **目标驱动执行** — 把任务转化为可验证目标，循环直到验证通过

## 工作流程
1. 新功能通过 /feature 命令触发
2. 跨多个页面/模块 → 先输出 Spec，确认后开发
3. 完成后运行 lint，review Agent 审查
4. 变更结构后更新 docs/knowledge/modules.md

## Git
- 格式: type(scope): description
- type: feat|fix|refactor|test|docs|chore|style

## 禁止
- 不虚构 API 或组件
- 不确定时先查 docs/knowledge/
- 不在 page 层直接写 fetch
- 不硬编码配置
- 不用 any
