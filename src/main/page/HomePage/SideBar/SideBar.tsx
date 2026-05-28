import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import Logo from '@/assets/logo.svg?react';
import './SideBar.scss';

const TOP_LEAF_KEYS = new Set(['/dashboard', '/admin/users', '/admin/system-configs']);

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function SideBar({ collapsed, onToggle }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const role = useAuthStore((s) => s.role);

  const selectedKey = location.pathname;

  const deriveOpenKeys = () =>
    location.pathname.startsWith('/admin/channel')
      ? ['channels']
      : location.pathname.startsWith('/admin/cp') || location.pathname.startsWith('/admin/registration')
        ? ['cps']
        : [];

  const [openKeys, setOpenKeys] = useState<string[]>(deriveOpenKeys);

  useEffect(() => {
    setOpenKeys(deriveOpenKeys());
  }, [location.pathname]);

  const menuItems: MenuProps['items'] = useMemo(() => [
    { key: '/dashboard', icon: <span>📊</span>, label: t('dashboard.title') },
    {
      key: 'channels',
      icon: <span>🔗</span>,
      label: t('channel.channels'),
      children: [
        { key: '/admin/channels', label: t('channel.channelList') },
        { key: '/admin/channel-accounts', label: t('channel.channelAccounts') },
        { key: '/admin/channel-products', label: t('channel.channelProducts') },
      ],
    },
    {
      key: 'cps',
      icon: <span>🏪</span>,
      label: t('cp.cps'),
      children: [
        { key: '/admin/cps', label: t('cp.cpList') },
        { key: '/admin/cp-apps', label: t('cp.cpApps') },
        { key: '/admin/registrations', label: t('cp.registrations') },
      ],
    },
    { key: '/admin/users', icon: <span>👥</span>, label: t('user.users') },
    { key: '/admin/system-configs', icon: <span>⚙️</span>, label: t('system.systemConfig') },
  ], [t, role]);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <Logo />
        <span className="logo-text">UMPay</span>
      </div>

      <Menu
        className="sidebar-menu"
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys.slice(-1))}
        items={menuItems}
        onClick={({ key }) => {
          if (TOP_LEAF_KEYS.has(key)) setOpenKeys([]);
          navigate(key);
        }}
      />

      <div className="sidebar-footer">
        <button className="collapse-btn" onClick={onToggle}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>
    </aside>
  );
}
