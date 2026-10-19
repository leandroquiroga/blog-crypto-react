import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { paths } from '@/router/paths';

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-brand-gradient font-display text-6xl font-bold">404</p>
      <h1 className="font-display text-2xl font-semibold">Pagina no encontrada</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        La ruta que buscas no existe o fue movida.
      </p>
      <Button asChild>
        <Link to={isAuthenticated ? paths.home : paths.login}>Volver al inicio</Link>
      </Button>
    </div>
  );
}
