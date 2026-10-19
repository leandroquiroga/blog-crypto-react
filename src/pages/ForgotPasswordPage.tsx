import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
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
import { paths } from '@/router/paths';
import { useAuthStore } from '@/store/auth.store';
import { getErrorMessage } from '@/utils/errors';

const resetSchema = z.object({
  email: z.email('Ingresa un email valido.'),
});

type ResetValues = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const requestPasswordReset = useAuthStore((state) => state.requestPasswordReset);
  const [isSent, setIsSent] = useState(false);

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ResetValues) => {
    try {
      await requestPasswordReset(values.email);
      setIsSent(true);
    } catch (cause) {
      form.setError('root', { message: getErrorMessage(cause) });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <AuthLayout
      title="Recupera tu contrasena"
      description="Te enviaremos un correo con las instrucciones para restablecerla."
      footer={
        <Link to={paths.login} className="font-medium text-primary hover:underline">
          Volver al inicio de sesion
        </Link>
      }
    >
      {isSent ? (
        <div
          role="status"
          className="flex flex-col items-center gap-3 rounded-lg bg-success/10 px-4 py-6 text-center"
        >
          <CheckCircle2 className="size-8 text-success" aria-hidden="true" />
          <p className="text-sm text-foreground">
            Si el email existe, vas a recibir un correo para restablecer tu contrasena.
          </p>
        </div>
      ) : (
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
              {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
            </Button>
          </form>
        </Form>
      )}
    </AuthLayout>
  );
}
