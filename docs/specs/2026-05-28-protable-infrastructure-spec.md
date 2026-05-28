# ProTable + MSW 基础设施 Spec

## 概述
建立 CRUD 页面的通用基础设施：`createCrudHandlers` 工厂（MSW 层）+ `useProTable` 包装器（页面层）+ `PageResponse` 共享类型。

## 影响分析
- 涉及页面：所有 admin CRUD 页面
- 涉及领域模块：domain/shared/types.ts
- 关键文件：mocks/utils/factory.ts、page/shared/useProTable.tsx

## API 契约
后端 8 个模块均遵循统一模式：
- LIST：`GET /api/v1/admin/{entity}?pageNum=&pageSize=` → `ApiResult<PageResponse<T>>`
- GET by id、POST、PUT、PUT status 均为标准端点

`PageResponse<T>`：`{ hasNext, page, size, items }`
`PaginationParams`：`{ pageNum: 1, pageSize: 20 }`

## 实现细节

### mocks/utils/factory.ts
- `createCrudHandlers<T>(basePath, initialData)` — 生成 LIST/GET/POST/PUT/PUT-status 5 个 handler
- 内存存储，支持分页（`pageNum`/`pageSize`）、过滤（自动匹配 query 参数）、自增 ID
- 响应格式对齐后端 `ApiResult<PageResponse<T>>`

### page/shared/useProTable.tsx
- `useProTable<T>({ columns, request, ... })` → `{ actionRef, TableComponent }`
- 统一 `pageNum`/`pageSize` 参数
- `hasNext` → `total` 转换
- `searchSpan` 可选配置
- 默认关闭 density 和 column setting
- 搜索参数自动透传（`...filters`）

### domain/shared/types.ts
- `Active` enum（ENABLED / DISABLED）
- `PageResponse<T>`
- `PaginationParams`
- `StatusUpdateRequest`

## 验收标准
- [x] 工厂生成 5 个 handler，分页+过滤正确
- [x] useProTable 与原 ProTable API 兼容
- [x] searchSpan 可选，不传则用 ProTable 默认值
- [x] 类型检查通过
- [x] UsersPage 作为首个使用方验证通过
