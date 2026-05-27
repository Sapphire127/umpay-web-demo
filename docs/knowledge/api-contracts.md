# API 契约

## 通用规范
- 基础路径: 由环境变量 VITE_API_BASE_URL 配置
- 认证: Bearer Token (JWT)，通过 Authorization header 传递
- 统一响应格式: { code: number, message: string, data: T }
- 分页: page, pageSize 参数，返回 { total: number, list: T[] }
- 错误码: code !== 0 表示异常

## apiClient 封装
统一在 src/apiClient.ts 中封装 fetch，处理：
- 自动拼接 base URL
- 自动附加 Authorization header
- 统一错误处理和提示
- 请求/响应拦截
