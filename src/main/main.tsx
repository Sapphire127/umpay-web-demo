import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { router } from './router';
import { useThemeStore } from './stores/themeStore';
import '@fontsource/cascadia-code';
import './style/index.scss';

function App() {
  const isDark = useThemeStore((s) => s.isDark);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontFamilyCode: 'var(--font-mono)',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
