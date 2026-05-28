import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import Logo from '@/assets/logo.svg?react';
import './SideBar.scss';

const menuItems: MenuProps['items'] = [
  { key: '/dashboard', icon: <span>📊</span>, label: 'Dashboard' },
  {
    key: 'channels',
    icon: <span>🔗</span>,
    label: 'Channels',
    children: [
      { key: '/admin/channels', label: 'Channels' },
      { key: '/admin/channel-accounts', label: 'Channel Accounts' },
      { key: '/admin/channel-products', label: 'Channel Products' },
    ],
  },
  {
    key: 'cps',
    icon: <span>🏪</span>,
    label: 'CPs',
    children: [
      { key: '/admin/cps', label: 'CPs' },
      { key: '/admin/cp-apps', label: 'CP Apps' },
      { key: '/admin/registrations', label: 'Registrations' },
    ],
  },
  { key: '/admin/users', icon: <span>👥</span>, label: 'Users' },
  { key: '/admin/system-configs', icon: <span>⚙️</span>, label: 'System Config' },
];

const TOP_LEAF_KEYS = new Set(['/dashboard', '/admin/users', '/admin/system-configs']);

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function SideBar({ collapsed, onToggle }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

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
