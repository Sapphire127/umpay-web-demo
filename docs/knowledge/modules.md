# 页面/模块映射

## 当前模块

### auth（认证模块）
- 职责: 管理员登录、JWT 管理、TOTP 验证
- 入口: domain/auth/authService.ts
- 页面: page/Login/, page/Dashboard/
- API: POST /api/v1/admin/auth/login

### stores（状态管理）
- authStore: token 管理、登录/登出、TOTP 流程
- themeStore: data-theme 切换、localStorage 持久化

## 项目目录结构
```
src/
  main/
    assets/                   # 静态资源（SVG、图片等）
    style/                    # 全局样式
      index.scss              # @use 入口
      theme.scss              # CSS 自定义属性（html[data-theme]）
      globals.scss            # 全局 class（.card, .title, .gain, .loss）
    domain/                   # 领域层（纯 TS，不依赖 UI）
      {module}/
        {entity}.ts           # 业务类型定义
        {entity}Service.ts    # 业务逻辑 + API
      shared/                 # 跨领域基础设施
        request.ts            # HTTP 请求封装
        response.ts           # 响应处理
        dates.ts / arrays.ts  # 通用工具
    page/                     # 页面层（React 组件）
      {Module}/
        {SubPage}/            # 组件+样式+私有 hook 共置
          {Component}.tsx
          {component}.ts      # 组件专属辅助方法
          {Component}.scss
          use{Thing}.ts
        shared/               # 模块内共享（翻译层 + 共享组件）
      shared/                 # 跨页面共享（通用 Modal、通用 hook、格式化工具）
    router.tsx
  _tests_/                    # 测试（与 main 镜像结构）
    domain/
    page/
```
