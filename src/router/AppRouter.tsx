import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { PageLoader } from '@/components/feedback/page-loader';
import { AppShell } from '@/components/layout/app-shell';
import { paths } from './paths';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

const HomePage = lazy(() => import('@/pages/HomePage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path={paths.login} element={<LoginPage />} />
            <Route path={paths.register} element={<RegisterPage />} />
            <Route path={paths.resetPassword} element={<ForgotPasswordPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path={paths.home} element={<HomePage />} />
              <Route path={paths.dashboard} element={<DashboardPage />} />
              <Route path={paths.portfolio} element={<PortfolioPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
