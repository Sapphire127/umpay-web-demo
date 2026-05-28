import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard, GuestGuard } from '@/page/shared/AuthGuard';
import LoginPage from '@/page/Login/LoginPage';
import Layout from '@/page/HomePage/Layout';

const DashboardPage = lazy(() => import('@/page/Dashboard/DashboardPage'));
const ChannelsPage = lazy(() => import('@/page/admin/channels/ChannelsPage'));
const ChannelAccountsPage = lazy(() => import('@/page/admin/channelAccounts/ChannelAccountsPage'));
const ChannelProductsPage = lazy(() => import('@/page/admin/channelProducts/ChannelProductsPage'));
const CPsPage = lazy(() => import('@/page/admin/cps/CPsPage'));
const CPAppsPage = lazy(() => import('@/page/admin/cpApps/CPAppsPage'));
const RegistrationsPage = lazy(() => import('@/page/admin/registrations/RegistrationsPage'));
const UsersPage = lazy(() => import('@/page/admin/users/UsersPage'));
const SystemConfigsPage = lazy(() => import('@/page/admin/systemConfigs/SystemConfigsPage'));

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <LazyPage><DashboardPage /></LazyPage> },
      { path: 'admin/channels', element: <LazyPage><ChannelsPage /></LazyPage> },
      { path: 'admin/channel-accounts', element: <LazyPage><ChannelAccountsPage /></LazyPage> },
      { path: 'admin/channel-products', element: <LazyPage><ChannelProductsPage /></LazyPage> },
      { path: 'admin/cps', element: <LazyPage><CPsPage /></LazyPage> },
      { path: 'admin/cp-apps', element: <LazyPage><CPAppsPage /></LazyPage> },
      { path: 'admin/registrations', element: <LazyPage><RegistrationsPage /></LazyPage> },
      { path: 'admin/users', element: <LazyPage><UsersPage /></LazyPage> },
      { path: 'admin/system-configs', element: <LazyPage><SystemConfigsPage /></LazyPage> },
    ],
  },
]);
