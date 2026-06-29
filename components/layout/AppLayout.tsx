import Link from 'next/link';
import { CalendarHeart, Heart, History, Home, MessageCircleHeart, Settings, Sparkles, WandSparkles } from 'lucide-react';
import type { Profile } from '@/lib/types';

const nav = [
  { href: '/', label: '首页', icon: Home },
  { href: '/records', label: '日常', icon: CalendarHeart },
  { href: '/anniversaries', label: '纪念日', icon: Sparkles },
  { href: '/wishlist', label: '心愿', icon: WandSparkles },
  { href: '/messages', label: '回忆', icon: MessageCircleHeart },
  { href: '/timeline', label: '时间线', icon: History },
  { href: '/settings', label: '设置', icon: Settings }
];

export function AppLayout({
  children,
  profile,
  guestToken
}: Readonly<{ children: React.ReactNode; profile?: Profile; guestToken?: string }>) {
  const items = guestToken ? nav.filter((item) => item.href !== '/settings') : nav;

  return (
    <div className="min-h-screen bg-[#fff7ef] pb-24 md:pb-0">
      <header className="sticky top-0 z-20 border-b-[3px] border-[#3f2f25] bg-[#fff7ef]/95 backdrop-blur-xl">
        <div className="page-shell flex h-16 items-center justify-between">
          <Link href={guestToken ? `/guest/access?token=${guestToken}` : '/'} className="flex items-center gap-3 font-black text-[#4a3329]">
            <span className="flex size-10 items-center justify-center rounded-full border-[3px] border-[#3f2f25] bg-[#f5b8c4]">
              <Heart className="fill-[#3f2f25] text-[#3f2f25]" size={18} />
            </span>
            <span className="hidden sm:inline">今天也喜欢你一下</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={guestToken ? `/guest/access?token=${guestToken}` : item.href}
                className="rounded-full border-2 border-[#3f2f25] bg-white px-4 py-2 text-sm font-black text-[#4a3329] shadow-[0_3px_0_rgba(63,47,37,0.15)] hover:bg-[#f6a052] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="rounded-full border-2 border-[#3f2f25] bg-[#f5b8c4] px-3 py-1 text-sm font-black text-[#4a3329]">
            {guestToken ? 'Guest' : profile?.role ?? 'Home'}
          </span>
        </div>
      </header>
      <main className="page-shell py-8">{children}</main>
      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 gap-2 rounded-3xl border-[3px] border-[#3f2f25] bg-white/90 p-2 shadow-love backdrop-blur-xl md:hidden">
        {items.slice(0, 8).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={guestToken ? `/guest/access?token=${guestToken}` : item.href}
              className="flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-bold text-rosehouse-muted"
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
