import { createBrowserRouter, Navigate } from 'react-router';
import { useAuth } from './contexts/auth-context';
import Login from './pages/login';
import Home from './pages/home';
import Control from './pages/control';
import Statistics from './pages/statistics';
import Logs from './pages/logs';
import Employees from './pages/employees';
import ChangePassword from './pages/change-password';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/home',
    Component: () => (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/control',
    Component: () => (
      <ProtectedRoute>
        <Control />
      </ProtectedRoute>
    ),
  },
  {
    path: '/statistics',
    Component: () => (
      <ProtectedRoute>
        <Statistics />
      </ProtectedRoute>
    ),
  },
  {
    path: '/logs',
    Component: () => (
      <ProtectedRoute>
        <Logs />
      </ProtectedRoute>
    ),
  },
  {
    path: '/employees',
    Component: () => (
      <ProtectedRoute>
        <Employees />
      </ProtectedRoute>
    ),
  },
  {
    path: '/change-password',
    Component: () => (
      <ProtectedRoute>
        <ChangePassword />
      </ProtectedRoute>
    ),
  },
]);