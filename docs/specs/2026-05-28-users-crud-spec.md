# 用户管理 CRUD Spec

## 概述
实现用户管理页面的列表展示、搜索过滤、状态切换功能。

## 影响分析
- 涉及页面：page/admin/users/UsersPage.tsx
- 涉及领域模块：domain/user/user.ts、domain/user/userService.ts
- 关键文件：mocks/handlers/user.ts、i18n
- 依赖关系：依赖 useProTable、createCrudHandlers

## API 契约

### GET /api/v1/admin/users?pageNum=&pageSize=&role=&status=
- 响应：`ApiResult<PageResponse<AdminUser>>`
- 过滤参数：role（可选）、status（可选），后端仅支持这两个字段

### PUT /api/v1/admin/users/{id}/status
- 请求体：`{ status: Active }`

## 实现细节

### domain/user/user.ts
- `AdminUser` 接口：id, username, name, role, cpId, totpBound, lastLoginAt, status, createdAt, updatedAt
- `AdminUserCreateRequest` 接口
- `status` 字段使用 `Active` 枚举替代字符串字面量

### domain/user/userService.ts
- `getUsers(params)` — 分页 + 过滤
- `getUser(id)` — 详情
- `createUser(req)` — 创建
- `updateUser(id, req)` — 更新
- `updateUserStatus(id, status: Active)` — 状态切换

### mocks/handlers/user.ts
- 2 条 mock 数据（admin + operator）
- `createCrudHandlers` 一键生成 5 端点

### page/admin/users/UsersPage.tsx
- ProTable 列：ID、username、name、role、status、lastLoginAt、操作
- 搜索：role（下拉）、status（下拉），username 不在搜索范围（后端不支持）
- 操作列：启用/停用切换按钮，使用 `actionRef.reload()` 刷新

## 验收标准
- [x] 列表分页正常
- [x] role/status 过滤生效
- [x] 状态切换按钮正常
- [x] 中英文切换正常
- [x] 搜索字段仅 role、status
