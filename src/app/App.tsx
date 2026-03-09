import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { SensorProvider } from './contexts/sensor-context';
import Login from './pages/login';
import Home from './pages/home';
import Control from './pages/control';
import Statistics from './pages/statistics';
import Logs from './pages/logs';
import Employees from './pages/employees';
import ChangePassword from './pages/change-password';
import YolobitConnect from './pages/yolobit-connect';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Router configuration inside a component that has access to AuthProvider
function AppRouter() {
  const router = createBrowserRouter([
    {
      path: '/',
      Component: Login,
    },
    {
      path: '/home',
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: '/control',
      element: (
        <ProtectedRoute>
          <Control />
        </ProtectedRoute>
      ),
    },
    {
      path: '/statistics',
      element: (
        <ProtectedRoute>
          <Statistics />
        </ProtectedRoute>
      ),
    },
    {
      path: '/logs',
      element: (
        <ProtectedRoute>
          <Logs />
        </ProtectedRoute>
      ),
    },
    {
      path: '/employees',
      element: (
        <ProtectedRoute>
          <Employees />
        </ProtectedRoute>
      ),
    },
    {
      path: '/change-password',
      element: (
        <ProtectedRoute>
          <ChangePassword />
        </ProtectedRoute>
      ),
    },
    {
      path: '/yolobit',
      element: (
        <ProtectedRoute>
          <YolobitConnect />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <SensorProvider>
        <AppRouter />
      </SensorProvider>
    </AuthProvider>
  );
}