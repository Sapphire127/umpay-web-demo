import { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useTranslation } from 'react-i18next';
import { router } from './router';
import { useThemeStore } from './stores/themeStore';

const antdLocales: Record<string, typeof zhCN> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

export default function App() {
  const isDark = useThemeStore((s) => s.isDark);
  const { i18n } = useTranslation();
  const locale = useMemo(() => antdLocales[i18n.language] || zhCN, [i18n.language]);

  return (
    <ConfigProvider
      locale={locale}
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
