import type { ReactNode } from 'react';
import { Logo } from '@/components/layout/logo';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/15 via-background to-accent/20"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <ModeToggle />
        </div>

        <Card className="gap-5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </CardHeader>

          <CardContent>{children}</CardContent>

          {footer ? (
            <CardFooter className="justify-center text-sm text-muted-foreground">{footer}</CardFooter>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
