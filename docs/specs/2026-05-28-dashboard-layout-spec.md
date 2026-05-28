# 主页布局 Spec

## 概述
搭建后台管理系统的布局框架：可折叠侧栏 + 顶栏 + 面包屑 + 内容区。

## 影响分析
- 涉及页面：Layout、SideBar、Header、所有占位页面
- 涉及领域模块：无（纯页面层）
- 关键文件：router.tsx、Layout.tsx、SideBar.tsx、Header.tsx
- 依赖关系：Layout 是其余页面的父路由容器

## API 契约
无新增 API。

## 实现细节

### Layout.tsx + Layout.scss
- flex 水平布局：SideBar + (Header + Outlet)
- 管理 collapsed 状态

### SideBar/SideBar.tsx + .scss
- Logo + Ant Design Menu（inline 模式）
- inlineCollapsed 支持
- 手风琴模式：同时最多展开一个子菜单
- 点击叶子菜单收起展开的子菜单
- openKeys 随路由变化同步

### Header/Header.tsx + .scss
- 面包屑：一级菜单 / 二级菜单（无 Home 前缀）
- LangSwitch + ThemeSwitch + 用户头像下拉（退出登录）

### 路由
- `/login` → GuestGuard + LoginPage
- `/` → AuthGuard + Layout → 9 个子路由

## 验收标准
- [x] 侧栏折叠/展开正常
- [x] 菜单选中项正确
- [x] 面包屑跟随路由
- [x] 主题/语言切换正常
- [x] 登录守卫正确重定向
