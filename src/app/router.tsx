import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { ComparePage } from '../features/compare/pages/ComparePage'
import { SessionDetailPage } from '../features/sessions/pages/SessionDetailPage'
import { SessionsPage } from '../features/sessions/pages/SessionsPage'
import { SettingsPage } from '../features/settings/pages/SettingsPage'
import { TrendsPage } from '../features/trends/pages/TrendsPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'sessions', element: <SessionsPage /> },
      { path: 'sessions/:id', element: <SessionDetailPage /> },
      { path: 'trends', element: <TrendsPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
