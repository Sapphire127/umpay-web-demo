# API 契约

## 通用规范
- 基础路径: 由环境变量 VITE_API_BASE_URL 配置
- 认证: Bearer Token (JWT)，通过 Authorization header 传递
- 统一响应格式: { code: number, message: string, data: T }
- 分页: page, pageSize 参数，返回 { total: number, list: T[] }
- 错误码: code !== 0 表示异常

## auth 模块 API

### POST /api/v1/admin/auth/login
- 请求: { username: string, password: string, totpCode?: string }
- 响应: ApiResponse<{ accessToken: string, expiresIn: number }>
- 认证: 无需
- 错误码: 1001(凭证错误，含 TOTP 错误), 1002(账户停用)

### POST /api/v1/admin/auth/logout
- 请求: 无，通过 Authorization header 传 token
- 响应: ApiResponse<null>
- 认证: 需要

## request.ts 封装
统一在 `domain/shared/request.ts` 中使用 Axios 封装，处理：
- 自动拼接 base URL（`VITE_API_BASE_URL`）
- 自动附加 Authorization header（Bearer Token）
- 统一错误处理和提示
- 请求/响应拦截器
