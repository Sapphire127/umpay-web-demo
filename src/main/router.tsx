import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './page/Login/LoginPage';
import DashboardPage from './page/Dashboard/DashboardPage';
import { AuthGuard, GuestGuard } from './page/shared/AuthGuard';

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
    path: '/dashboard',
    element: (
      <AuthGuard>
        <DashboardPage />
      </AuthGuard>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
