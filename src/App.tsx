import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/feedback/error-boundary';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { useAuthListener } from '@/hooks/useAuthListener';
import { queryClient } from '@/lib/query-client';
import { AppRouter } from '@/router/AppRouter';

export function App() {
  useAuthListener();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
