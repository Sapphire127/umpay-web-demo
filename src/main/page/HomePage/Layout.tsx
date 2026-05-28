import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar/SideBar';
import Header from './Header/Header';
import './Layout.scss';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <SideBar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="main-area">
        <Header />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
