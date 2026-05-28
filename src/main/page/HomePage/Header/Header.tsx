import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumb, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import LangSwitch from '@/page/shared/LangSwitch';
import ThemeSwitch from '@/page/shared/ThemeSwitch';
import './Header.scss';

export default function Header() {
  const { t } = useTranslation();
  const { logout, username } = useAuthStore();
  const location = useLocation();

  const breadcrumbItems = useMemo(() => {
    const path = location.pathname;
    const map: Record<string, { label: string; parent?: string }> = {
      '/dashboard': { label: t('dashboard.title') },
      '/admin/channels': { label: t('channel.channelList'), parent: t('channel.channels') },
      '/admin/channel-accounts': { label: t('channel.channelAccounts'), parent: t('channel.channels') },
      '/admin/channel-products': { label: t('channel.channelProducts'), parent: t('channel.channels') },
      '/admin/cps': { label: t('cp.cpList'), parent: t('cp.cps') },
      '/admin/cp-apps': { label: t('cp.cpApps'), parent: t('cp.cps') },
      '/admin/registrations': { label: t('cp.registrations'), parent: t('cp.cps') },
      '/admin/users': { label: t('user.users') },
      '/admin/system-configs': { label: t('system.systemConfig') },
    };
    const entry = map[path];
    if (!entry) return [{ title: path }];
    const items: { title: string }[] = [];
    if (entry.parent) items.push({ title: entry.parent });
    items.push({ title: entry.label });
    return items;
  }, [location.pathname, t]);

  const userMenuItems = useMemo(
    () => [
      { key: 'logout', icon: <LogoutOutlined />, label: t('header.logout'), onClick: logout },
    ],
    [logout, t]
  );

  return (
    <header className="top-header">
      <div className="header-left">
        <Breadcrumb className="breadcrumb" items={breadcrumbItems} />
      </div>

      <div className="header-actions">
        <LangSwitch />
        <ThemeSwitch />
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div className="user-trigger">
            <Avatar size={24} icon={<UserOutlined />} />
            <span className="user-name">{username}</span>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
