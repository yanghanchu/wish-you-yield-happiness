import Link from 'next/link';
import { CalendarHeart, Gift, Heart, MessageCircleHeart, Sparkles, WandSparkles } from 'lucide-react';
import { redirect } from 'next/navigation';
import { AvatarUploader } from '@/components/AvatarUploader';
import { AppLayout } from '@/components/layout/AppLayout';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { createClient } from '@/lib/supabase/server';
import { calculateLoveDays } from '@/lib/utils/dates';
import type { Profile, UserRole } from '@/lib/types';

const START_DATE = '2026-05-20';

const shortcuts = [
  { href: '/records', label: '日常记录', text: '记录美好瞬间', icon: CalendarHeart },
  { href: '/anniversaries', label: '纪念日', text: '重要的日子', icon: Sparkles },
  { href: '/wishlist', label: '心愿清单', text: '未来的计划', icon: WandSparkles },
  { href: '/timeline', label: '回忆库', text: '珍藏的时光', icon: MessageCircleHeart }
];

export default async function HomePage() {
  const current = await getCurrentUser();

  if (!current) {
    redirect('/login');
  }

  const supabase = await createClient();
  const { data: profiles } = await supabase.from('profiles').select('id, role, display_name, avatar_url');
  const profileMap = new Map((profiles ?? []).map((profile) => [profile.role, profile as Profile]));
  const loveDays = calculateLoveDays(START_DATE);

  return (
    <AppLayout profile={current.profile}>
      <section className="min-h-[calc(100vh-8rem)]">
        <div className="mx-auto w-full max-w-6xl">
          <div className="relative overflow-hidden rounded-[34px] border-4 border-[#3f2f25] bg-[#fff5ea] px-5 py-12 shadow-[0_18px_0_rgba(63,47,37,0.08)] md:px-10 md:py-16">
            <Decorations />
            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_1.4fr_1fr]">
              <AvatarUploader ownerRole="WY" currentRole={current.profile.role} profile={profileMap.get('WY')} />

              <div className="text-center">
                <p className="text-lg font-black tracking-[0.18em] text-[#9f8a78]">我们已相爱</p>
                <div className="mt-5 flex items-end justify-center gap-3">
                  <span className="text-7xl font-black leading-none text-[#f39b58] drop-shadow-sm md:text-9xl">{loveDays}</span>
                  <span className="mb-3 text-3xl font-black text-[#5a3d35] md:text-5xl">天</span>
                </div>
                <div className="mx-auto mt-7 flex max-w-md items-center justify-center gap-4 text-[#f5a5b5]">
                  <span className="h-[3px] flex-1 rounded-full bg-[#f7c4cf]" />
                  <Heart className="fill-current" size={34} />
                  <span className="h-[3px] flex-1 rounded-full bg-[#f7c4cf]" />
                </div>
                <p className="mt-5 text-sm font-black tracking-[0.16em] text-[#8b7768]">从 2026 年 5 月 20 日开始</p>
              </div>

              <AvatarUploader ownerRole="YYH" currentRole={current.profile.role} profile={profileMap.get('YYH')} />
            </div>
          </div>

          <section className="mt-10">
            <div className="mb-4 flex items-center gap-2 text-[#5a3d35]">
              <Gift className="text-[#f39b58]" size={24} />
              <h2 className="text-2xl font-black">快速入口</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {shortcuts.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-[24px] border-[3px] border-[#3f2f25] bg-white/85 p-6 text-center shadow-[0_8px_0_rgba(63,47,37,0.08)] transition hover:-translate-y-1 hover:bg-[#fffaf3]"
                  >
                    <div className="mx-auto flex size-24 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#3f2f25] bg-[#ffe9d2] text-[#f39b58] transition group-hover:scale-105">
                      <Icon size={34} />
                    </div>
                    <p className="mt-4 text-xl font-black text-[#4a3329]">{item.label}</p>
                    <p className="mt-2 text-sm font-bold text-[#9f8a78]">{item.text}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </AppLayout>
  );
}

function Decorations() {
  return (
    <>
      <span className="absolute left-8 top-10 text-3xl text-[#f5c4cf]">♡</span>
      <span className="absolute bottom-10 left-12 text-2xl text-[#e7d6c8]">✦</span>
      <span className="absolute right-12 top-12 text-2xl text-[#e7d6c8]">✧</span>
      <span className="absolute bottom-12 right-10 text-3xl text-[#f5c4cf]">♡</span>
    </>
  );
}
