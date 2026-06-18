import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

export function PrimaryButton({ className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={cn(
        variant === 'primary' && 'primary-button',
        variant === 'secondary' && 'secondary-button',
        variant === 'danger' &&
          'inline-flex items-center justify-center rounded-full bg-red-50 px-4 py-3 font-bold text-red-600 ring-1 ring-red-100',
        className
      )}
      {...props}
    />
  );
}
