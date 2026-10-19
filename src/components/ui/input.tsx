import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm outline-none transition-colors',
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'file:mr-2 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40',
        'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30',
        'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
