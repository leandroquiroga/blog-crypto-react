import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthLayout } from '@/components/layout/auth-layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { paths } from '@/router/paths';
import { useAuthStore } from '@/store/auth.store';
import { getErrorMessage } from '@/utils/errors';

const loginSchema = z.object({
  email: z.email('Ingresa un email valido.'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres.'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const loginWithEmail = useAuthStore((state) => state.loginWithEmail);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      await loginWithEmail(values.email, values.password);
      toast.success('Bienvenido de nuevo.');
    } catch (cause) {
      form.setError('root', { message: getErrorMessage(cause) });
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle();
      toast.success('Sesion iniciada con Google.');
    } catch (cause) {
      toast.error(getErrorMessage(cause));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <AuthLayout
      title="Inicia sesion"
      description="Accede a las noticias, el mercado y tu portfolio personal."
      footer={
        <>
          ¿No tenes cuenta?
          <Link to={paths.register} className="ml-1 font-medium text-primary hover:underline">
            Registrate
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="tu@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Contrasena</FormLabel>
                    <Link to={paths.resetPassword} className="text-xs text-primary hover:underline">
                      ¿La olvidaste?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      autoComplete="current-password"
                      placeholder="Tu contrasena"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root ? (
              <p
                role="alert"
                className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {form.formState.errors.root.message}
              </p>
            ) : null}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              {isSubmitting ? 'Ingresando...' : 'Iniciar sesion'}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <span className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </span>
          <span className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">o</span>
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isGoogleLoading}
          onClick={() => {
            void handleGoogleLogin();
          }}
        >
          {isGoogleLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <img
              src="/assets/svg/google-icon.svg"
              alt=""
              width={16}
              height={16}
              className="size-4"
            />
          )}
          Iniciar sesion con Google
        </Button>
      </div>
    </AuthLayout>
  );
}
