# 技术栈

## 核心框架
- React 18+ (函数组件 + Hooks)
- TypeScript 5+ (strict 模式)
- Vite 6+ (构建工具，HMR)
- react-router 6+ (路由，路由守卫)
- Zustand 4+ (状态管理，persist 中间件)
- Ant Design 5+ (UI 组件库)
- @ant-design/pro-components (ProTable 等高级组件)
- @ant-design/icons (图标)

## 数据处理
- Axios (HTTP 客户端，统一拦截器、token 注入、错误处理)
- Day.js (轻量日期库，Ant Design 5 内置依赖)
- Recharts (数据可视化图表)

## 样式
- SCSS (组件样式，根类名作用域隔离)
- CSS 自定义属性 (主题系统)
- Cascadia Code (数据展示等宽字体，表格式数字对齐)

## 开发 & 测试
- Vitest 4+ (测试框架)
- @testing-library/react (组件测试)
- @testing-library/jest-dom (DOM 断言)
- JSDOM (浏览器模拟)
- MSW (API Mock，后端未就绪时按契约 mock)
- @vitest/coverage-v8 (覆盖率)
- ESLint + Prettier (代码规范)
