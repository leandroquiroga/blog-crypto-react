import { Navigate, Outlet, useLocation } from 'react-router';
import { FullPageLoader } from '@/components/feedback/page-loader';
import { useAuth } from '@/hooks/useAuth';
import { paths } from './paths';

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'initializing') {
    return <FullPageLoader label="Verificando sesion..." />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
