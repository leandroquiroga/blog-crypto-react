import { Outlet } from 'react-router';
import { Navbar } from './navbar';

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-border/60 py-6">
        <p className="text-center text-xs text-muted-foreground">
          Blog Crypto · Datos de CoinGecko y CryptoCompare
        </p>
      </footer>
    </div>
  );
}
