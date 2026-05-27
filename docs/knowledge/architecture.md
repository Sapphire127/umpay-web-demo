# 系统架构概览

## 整体架构
前后端分离的 SPA 应用：
- 前端: React 18 SPA，通过 HTTP API 与后端通信
- 后端: 独立 REST API 服务（不在本项目内）

## 前端分层
```
┌──────────────────────────────────────┐
│      style/  全局样式                 │
│      theme.scss                       │  ← CSS 自定义属性，html[data-theme]
│      globals.scss                     │  ← 全局 class（.card, .title, .gain）
│      index.scss                       │  ← @use 入口
├──────────────────────────────────────┤
│      page/  页面层                    │
│      {Module}/{SubPage}/              │  ← React 组件 + 样式 + 私有 hook
│        {Component}.tsx                │     组件、样式、hook 共置
│        {component}.ts                 │     组件专属辅助方法
│        {Component}.scss               │
│        use{Thing}.ts                  │
│      shared/                          │  ← 跨页面 React 组件 + hook + TS 工具
├──────────────────────────────────────┤
│      domain/  领域层                  │  ← 纯 TypeScript，不依赖 React
│      {module}/                        │
│        {entity}.ts                    │  ← 业务类型定义
│        {entity}Service.ts             │  ← 业务逻辑 + API 调用
│      shared/                          │  ← 基础设施
│        request.ts                     │  ← HTTP 请求封装
│        response.ts                    │  ← 响应处理
│        dates.ts / arrays.ts           │  ← 通用工具
└──────────────────────────────────────┘
```

## 数据流
```
page/ → domain/Service → domain/shared/request.ts → 后端 API
  ↑                         ↓
  │    domain/{module}/*.ts (业务类型定义)
  │
  └── page/{Module}/shared/ (展示格式化、术语翻译)
```

- page 层不直接调用 fetch，通过 domain Service
- domain 层不依赖 React，可被测试独立引用
- `page/{Module}/shared/` 是 domain 数据和 UI 之间的翻译层

## 主题系统
- CSS 层：`style/theme.scss` 定义 CSS 变量，`html[data-theme="dark"]` 切换
- React 层：Ant Design `ConfigProvider theme.algorithm` 控制组件主题
- 状态层：Zustand store 管理 `data-theme` 属性 + localStorage 持久化

## 测试结构
```
src/
  main/           # 源码
  _tests_/        # 测试（与 main 镜像结构）
    domain/
      {module}/
    page/
      {Module}/
```
