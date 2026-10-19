import { Navigate, Outlet } from 'react-router';
import { FullPageLoader } from '@/components/feedback/page-loader';
import { useAuth } from '@/hooks/useAuth';
import { paths } from './paths';

export function PublicRoute() {
  const { status } = useAuth();

  if (status === 'initializing') {
    return <FullPageLoader label="Verificando sesion..." />;
  }

  if (status === 'authenticated') {
    return <Navigate to={paths.home} replace />;
  }

  return <Outlet />;
}
