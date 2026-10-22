import { LineChart, Menu, Newspaper, Wallet, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { paths } from '@/router/paths';
import { Logo } from './logo';
import { UserMenu } from './user-menu';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: paths.home, label: 'Noticias', icon: Newspaper },
  { to: paths.dashboard, label: 'Dashboard', icon: LineChart },
  { to: paths.portfolio, label: 'Portfolio', icon: Wallet },
];

interface NavItemLinkProps extends NavItem {
  onNavigate?: () => void;
}

function NavItemLink({ to, label, icon: Icon, onNavigate }: NavItemLinkProps) {
  return (
    <NavLink
      to={to}
      end={to === paths.home}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-secondary text-secondary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        )
      }
    >
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </NavLink>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav
        aria-label="Navegacion principal"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4"
      >
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavItemLink key={item.to} {...item} />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <ModeToggle />
          <UserMenu />

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Navegacion</SheetTitle>
                <SheetDescription className="sr-only">
                  Enlaces principales de la aplicacion
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Navegacion movil" className="flex flex-col gap-1 px-4">
                {NAV_ITEMS.map((item) => (
                  <NavItemLink key={item.to} {...item} onNavigate={() => setIsMenuOpen(false)} />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
