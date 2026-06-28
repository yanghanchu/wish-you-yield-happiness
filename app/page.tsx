import Link from 'next/link';
import { CalendarHeart, Heart, MessageCircleHeart, Sparkles, WandSparkles } from 'lucide-react';
import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { calculateLoveDays } from '@/lib/utils/dates';

const START_DATE = '2026-05-20';

const shortcuts = [
  { href: '/records', label: '恋爱记录', icon: CalendarHeart },
  { href: '/anniversaries', label: '纪念日', icon: Sparkles },
  { href: '/wishlist', label: '愿望清单', icon: WandSparkles },
  { href: '/messages', label: '留言墙', icon: MessageCircleHeart }
];

export default async function HomePage() {
  const current = await getCurrentUser();

  if (!current) {
    redirect('/login');
  }

  const loveDays = calculateLoveDays(START_DATE);

  return (
    <AppLayout profile={current.profile}>
      <section className="flex min-h-[calc(100vh-8rem)] flex-col justify-center">
        <div className="mx-auto w-full max-w-5xl">
          <div className="love-card relative overflow-hidden px-6 py-12 text-center md:px-12 md:py-16">
            <div className="absolute left-8 top-8 size-24 rounded-full bg-pink-100/80 blur-2xl" />
            <div className="absolute bottom-6 right-10 size-28 rounded-full bg-purple-100/80 blur-2xl" />
            <div className="relative">
              <p className="text-sm font-black text-rosehouse-muted">我们已经在一起</p>
              <div className="mt-5 flex items-end justify-center gap-3">
                <span className="text-7xl font-black leading-none text-rosehouse-deep md:text-9xl">{loveDays}</span>
                <span className="mb-3 text-2xl font-black md:text-4xl">天</span>
              </div>
              <div className="mx-auto mt-7 flex max-w-md items-center justify-center gap-4 text-rosehouse-primary">
                <span className="h-px flex-1 bg-pink-200" />
                <Heart className="fill-current" size={24} />
                <span className="h-px flex-1 bg-pink-200" />
              </div>
              <p className="mt-5 text-lg font-black">今天也喜欢你一下</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="love-card flex min-h-32 flex-col items-center justify-center gap-3 p-5 text-center transition hover:-translate-y-1 hover:bg-white/95"
                >
                  <Icon className="text-rosehouse-deep" size={26} />
                  <span className="text-lg font-black">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
