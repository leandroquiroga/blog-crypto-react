import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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

const registerSchema = z
  .object({
    email: z.email('Ingresa un email valido.'),
    password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres.'),
    passwordConfirm: z.string().min(1, 'Confirma tu contrasena.'),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    message: 'Las contrasenas no coinciden.',
    path: ['passwordConfirm'],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const registerWithEmail = useAuthStore((state) => state.registerWithEmail);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', passwordConfirm: '' },
  });

  const onSubmit = async (values: RegisterValues) => {
    try {
      await registerWithEmail(values.email, values.password);
      toast.success('Tu cuenta se creo correctamente.');
    } catch (cause) {
      form.setError('root', { message: getErrorMessage(cause) });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <AuthLayout
      title="Crea tu cuenta"
      description="Registrate para guardar tu portfolio y seguir el mercado."
      footer={
        <>
          ¿Ya tenes cuenta?
          <Link to={paths.login} className="ml-1 font-medium text-primary hover:underline">
            Inicia sesion
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="tu@email.com" {...field} />
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
                <FormLabel>Contrasena</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    placeholder="Minimo 6 caracteres"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeti la contrasena</FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="new-password"
                    placeholder="Repeti tu contrasena"
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
            {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
