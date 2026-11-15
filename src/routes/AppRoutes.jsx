import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { UsersPage } from '../pages/UsersPage';
import { CategoriasPage } from '../pages/CategoriasPage';
import { ClientesPage } from '../pages/ClientesPage';
import { ProductosPage } from '../pages/ProductosPage';
import { ComprarPage } from '../pages/ComprarPage';
import { RentarPage } from '../pages/RentarPage';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES } from '../constants/routeConstants';
import { useAuth } from '../hooks/useAuth';

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Root Route: Redirects to dashboard if logged in, else login */}
      <Route
        path={ROUTES.ROOT}
        element={
          isAuthenticated ? (
            <Navigate to={ROUTES.DASHBOARD} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Login Route */}
      <Route
        path={ROUTES.LOGIN}
        element={
          isAuthenticated ? (
            <Navigate to={ROUTES.DASHBOARD} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* Protected Dashboard inside Layout with Sidebar */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="comprar" element={<ComprarPage />} />
        <Route path="rentar" element={<RentarPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to={ROUTES.ROOT} replace />} />
    </Routes>
  );
};
