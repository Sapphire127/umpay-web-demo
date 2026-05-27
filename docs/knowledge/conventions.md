# 编码规约

## 文件组织
- 组件文件共置：`.tsx` + 同名小写 `.ts`（辅助方法） + `.scss` + 私有 hook 放同一目录
- 复杂计算逻辑从组件中抽出，放组件同名的 `.ts` 文件
- 不要按类型跨目录拆分

## 命名规范

| 类别 | 命名方式 | 示例 |
|---|---|---|
| 组件文件 | PascalCase，名词 | `AssetList.tsx` |
| 组件主函数 | 与文件名相同 | `function AssetList() {}` |
| 组件辅助文件 | camelCase，名词（与组件同名小写） | `assetList.ts` |
| 业务方法 | 动词/动名词组 | `getAccount()`, `calculateROI()` |
| 纯逻辑文件 | camelCase，名词 | `trendData.ts`, `tradingFormatter.ts` |
| Hook 文件 | use + 名词，camelCase | `useSymbols.ts` |
| 样式文件 | 与组件同名 | `AssetList.scss` |

## SCSS

### 全局样式（style/）
- `style/theme.scss` 定义 CSS 自定义属性（设计令牌）：
  ```scss
  :root {
      --color-primary: #1677ff;
      --color-success: #52c41a;
      --color-error: #ff4d4f;
      --color-text-primary: #1a1d2e;
      --color-text-secondary: #7c829a;
      --color-bg-container: #ffffff;
      --color-bg-layout: #f5f7fb;
      --color-border: #d4d9e8;
      --spacing-md: 16px;
      --radius-card: 16px;
  }

  [data-theme="dark"] {
      --color-text-primary: #e8eaed;
      --color-text-secondary: #9aa0a6;
      --color-bg-container: #1e1e1e;
      --color-bg-layout: #141414;
      --color-border: #303030;
  }
  ```
- `style/globals.scss` 定义全局 class，引用 theme 变量：
  ```scss
  .card { padding: var(--spacing-md); border-radius: var(--radius-card); background: var(--color-bg-container); }
  .gain { color: var(--color-success); }
  .loss { color: var(--color-error); }
  .disabled { color: var(--color-text-secondary); }
  .title { font-size: 18px; font-weight: 600; }
  .secondaryTitle { font-size: 16px; font-weight: 500; }
  .tertiaryTitle { font-size: 14px; font-weight: 400; }
  ```
- `style/index.scss` 作为入口 `@use 'theme'; @use 'globals';`
- 在 `main.tsx` 中一行引入：`import '@/style/index.scss';`

### 组件样式（page/）
- 每个组件一个同名 `.scss`，与 `.tsx` 共置
- 用组件根类名包裹所有子样式，做作用域隔离：
  ```scss
  .assetList {
      .header { display: flex; }
      .table { width: 100%; }
  }
  ```
- 不采用 BEM 命名拆平

### 覆盖组件库样式
- 必须从组件根类名开始写嵌套，不直接修改全局 Ant Design 样式：
  ```scss
  // ✅ 正确 —— 只影响 .addTable 内部的表格
  .addTable {
      .ant-table-cell { padding: 8px; }
      .ant-table-thead .ant-table-cell:last-child { text-align: center; }
  }

  // ❌ 错误 —— 影响全局
  .ant-table-cell { padding: 8px; }
  ```

## TypeScript
- 禁止 any，确有必要标注理由
- 接口用 interface，类型别名用 type

## 类型定义规则
- **domain 层的业务类型**：放在对应业务模型的 `.ts` 文件中（如 `trading.ts` 定义 Trading 相关 interface/type）
- **page 层的类型**：单个组件使用的 Props 写在组件文件内；跨组件使用的提取到 `page/{Module}/shared/` 或 `page/shared/`

## React 组件
- 函数组件 + Hooks
- Props 类型显式定义
- 页面级组件包裹 ErrorBoundary

## API 调用
- domain Service 层调用 `domain/shared/request.ts`
- page 层通过 Service 获取数据，不直接写 fetch

## 分层边界

### style/ — 全局样式（纯 SCSS）
- 设计令牌（CSS 变量）和全局 class
- 不包含 React 组件或 TS 逻辑
- `theme.scss` 通过 `html[data-theme]` 支持主题切换

### domain/shared/ — 业务无关的基础设施
- HTTP 封装（`request.ts`, `response.ts`）
- 通用工具（`dates.ts`, `arrays.ts`, `envConfig.ts`）
- 不包含任何展示逻辑

### page/shared/ — 跨页面 React 组件 + TS 工具
- 通用 Modal（`DeleteModal.tsx`, `ConfirmModal.tsx`）
- 通用 hook（`useModal.ts`, `useConfirmModal.ts`）
- 格式化工具（`numberFormatter.ts`）
- 不放样式文件

### page/{Module}/shared/ — 模块内共享
- 业务 → 展示的翻译层（`{module}Formatter.ts`, `{module}Translator.ts`）
- 模块内共享的 React 组件
- **边界**：domain 返回原始数据（`Date`, `number`, `enum`），翻译层决定显示成什么字符串

## 主题切换
- CSS 变量在 `style/theme.scss` 中通过 `:root` 和 `[data-theme="dark"]` 定义
- Ant Design 组件通过 `ConfigProvider theme.algorithm` 切换
- 切换状态用 Zustand store 管理，设置 `document.documentElement.setAttribute('data-theme', ...)`
- 偏好持久化到 localStorage

## 共享级别
- 单个组件内复用 → 放组件同名 `.ts` 文件
- 单个页面内跨组件 → 放页面目录内
- 模块内跨页面 → 放 `page/{Module}/shared/`
- 跨模块 → 放 `page/shared/`（React/TS）或 `domain/shared/`（业务无关）或 `style/`（纯 CSS）

## Git
- 格式: type(scope): description
- type: feat|fix|refactor|test|docs|chore|style
