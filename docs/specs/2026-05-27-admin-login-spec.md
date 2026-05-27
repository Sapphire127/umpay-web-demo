# 管理员登录功能 Spec

## 概述
实现管理员登录功能，username + password + totpCode(选填) → JWT token → 跳转 Dashboard。
参照 UMPay 后端 `POST /api/v1/admin/auth/login`，设计稿 `/home/wxy/桌面/umpay/原型.html`。

## 影响分析
- 涉及页面：Login（新增）、Dashboard（新增占位）
- 涉及领域模块：auth（新增）
- 涉及状态：authStore（新增）
- 涉及路由：router.tsx（修改）
- 涉及 Mock：MSW handlers（新增）
- 依赖关系：authStore ← authService ← request.ts

## API 契约

### POST /api/v1/admin/auth/login
- 请求：`{ username: string, password: string, totpCode?: string }`
- 响应：`ApiResponse<{ accessToken: string, expiresIn: number }>`
- 认证：无需
- 错误码：1001(凭证错误+TOTP错误), 1002(账户停用)

## 实现详情（与代码一致）

### auth 类型 — `domain/auth/auth.ts`
- `LoginRequest { username, password, totpCode? }`
- 验收：字段与后端 LoginRequest.java 一致

### auth Service — `domain/auth/authService.ts`
- `login(req): Promise<LoginResponse>`，通过 `request.ts post()` 调用
- 验收：无需 TOTP 的用户提交后返回 token

### MSW Mock — `src/mocks/handlers/auth.ts`
- admin/admin123 → 无 TOTP，直接返回 token
- operator/oper123 → 有 TOTP，TOTP 为 `123456`，在单次请求中校验
- 密码或 TOTP 错误 → 统一 AUTH_CREDENTIALS_ERROR (1001)
- 验收：与后端 AuthService.java 逻辑一致

### authStore — `stores/authStore.ts`
- Zustand + persist(`auth-store`)
- `token`, `isLoading`, `errorMsg`
- `login(req)`: 成功后写 `localStorage.setItem('token')` + store 更新
- `logout()`: 清除 localStorage token + 跳转 /login
- 验收：登录后刷新页面保持登录态

### LoginPage — `page/Login/LoginPage.tsx` + `LoginPage.scss`
- 页面居中，背景几何底纹，参照设计稿
- 右上角 headerBar：语言切换(中/EN) + 主题切换
- 登录卡片：Logo + 标题 + username + password(show/hide) + TOTP 输入(选填)
- 错误提示 + loading 态
- 验收：无 TOTP 用户登录后直接跳转 /dashboard

### Dashboard — `page/Dashboard/DashboardPage.tsx`
- 占位页面
- 验收：路由 `/dashboard` 可渲染

### 路由 — `router.tsx`
- `/login` + `/dashboard` + fallback `*` → `/dashboard`
- AuthGuard：无 token redirect /login
- GuestGuard：有 token redirect /dashboard
- 验收：未登录访问 /dashboard 跳回 /login

## 验收标准
- [x] 用户名+密码输入后可提交
- [x] 无 TOTP 用户（admin）登录后跳转 /dashboard
- [x] 有 TOTP 用户（operator）输入正确 TOTP 后跳转 /dashboard
- [x] 错误密码显示错误提示
- [x] Token 持久化，刷新后仍保持登录态
- [x] npm run lint 通过
- [x] npm run build 通过

## 设计修正记录

以下为初始 Spec 中的错误及修正原因。

### 错误 1：TOTP 分步流程（Modal 弹出）

**初始设计**：username+password 提交后，如果用户有 TOTP，后端返回 code 1002 触发前端弹出 Modal，用户输入 TOTP 后二次提交。

**为什么错**：阅读了 `AuthService.java` 后确认，后端不存在独立 TOTP 状态码。TOTP 缺失/错误与密码错误统一返回 `AUTH_CREDENTIALS_ERROR`，无法区分。

**修正**：TOTP 与 username+password 在单次请求中一起提交。前端表单增加 TOTP 选填输入框，不采用 Modal 分步。

### 错误 2：自定义错误码 1002/1003

**初始设计**：MSW mock 定义 1002(需TOTP)、1003(TOTP错误) 两个自定义错误码。

**为什么错**：真实后端只有 `AUTH_CREDENTIALS_ERROR` 和 `AUTH_ACCOUNT_DISABLED`。自定义错误码与后端不一致，联调时 authStore 的错误处理逻辑会失效。

**修正**：MSW mock 改为只使用 AUTH_CREDENTIALS_ERROR(1001)，与后端一致。

### 错误 3：AuthGuard 读取 localStorage

**初始设计**：AuthGuard 通过 `localStorage.getItem('auth-store')` 读取 token。

**为什么错**：Zustand persist 中间件异步写入 localStorage。登录成功后 `set({ token })` 先更新内存，navigate 触发 AuthGuard 时 localStorage 尚未落盘，读到空 token 触发错误重定向。

**修正**：AuthGuard 改为从 Zustand store 内存状态读取 token（`useAuthStore((s) => s.token)`）。

### 错误 4：Axios baseURL 设为绝对路径

**初始设计**：`axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })`，请求发往 `http://localhost:8080`。

**为什么错**：跨域请求 MSW 不拦截，直接 pass through 到不存在的后端，所有 mock 失效。

**修正**：移除 `baseURL`，请求使用相对路径同源发送，MSW 正常拦截。

### 错误 5：Logo 作为 React 组件

**初始设计**：`page/shared/Logo.tsx` 中硬编码 SVG JSX。

**为什么错**：Logo 是静态资源而非交互组件。硬编码在 TSX 中无法被设计工具直接编辑，且位置不当（page/shared 是跨页面组件目录）。

**修正**：改为 `assets/logo.svg` 原始 SVG 文件，通过 `?react` 后缀导入为组件。CSS 变量 `var(--color-primary)` 继承主题色。
