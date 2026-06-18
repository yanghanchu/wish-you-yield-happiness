import { cn } from '@/lib/utils/cn';

export function PinkCard({
  children,
  className
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <section className={cn('love-card p-5', className)}>{children}</section>;
}
