import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumb, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import LangSwitch from '@/page/shared/LangSwitch';
import ThemeSwitch from '@/page/shared/ThemeSwitch';
import './Header.scss';

const BREADCRUMB_MAP: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/admin/channels': 'Channels',
  '/admin/channel-accounts': 'Channel Accounts',
  '/admin/channel-products': 'Channel Products',
  '/admin/cps': 'CPs',
  '/admin/cp-apps': 'CP Apps',
  '/admin/registrations': 'Registrations',
  '/admin/users': 'Users',
  '/admin/system-configs': 'System Configs',
};

export default function Header() {
  const { t } = useTranslation();
  const { logout } = useAuthStore();
  const location = useLocation();

  const breadcrumbItems = useMemo(() => {
    const title = BREADCRUMB_MAP[location.pathname] || location.pathname;
    return [{ title: 'Home' }, { title }];
  }, [location.pathname]);

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
            <span className="user-name">Admin</span>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
