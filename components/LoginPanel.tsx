'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DoorOpen, Heart, KeyRound, UserRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PinkCard } from '@/components/ui/PinkCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export function LoginPanel() {
  const [role, setRole] = useState<'WY' | 'YYH' | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(formData.get('email')),
      password: String(formData.get('password'))
    });

    if (signInError) {
      setError('登录信息好像不对哦，再试一次吧');
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {(['WY', 'YYH'] as const).map((item) => (
        <button key={item} onClick={() => setRole(item)} className="love-card p-6 text-left transition hover:-translate-y-1 hover:bg-white/90">
          <UserRound className="text-rosehouse-deep" />
          <h2 className="mt-4 text-2xl font-black">{item}</h2>
          <p className="mt-2 text-sm text-rosehouse-muted">
            {item === 'WY' ? '进入小屋，继续收藏我们的回忆' : '回到小屋，看看今天的甜蜜'}
          </p>
        </button>
      ))}
      <button onClick={() => router.push('/guest-request')} className="love-card p-6 text-left transition hover:-translate-y-1 hover:bg-white/90">
        <DoorOpen className="text-rosehouse-deep" />
        <h2 className="mt-4 text-2xl font-black">访客访问</h2>
        <p className="mt-2 text-sm text-rosehouse-muted">申请参观公开的小屋内容</p>
      </button>

      {role && (
        <PinkCard className="md:col-span-3">
          <form action={onSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <label className="text-sm font-bold">
              <span className="mb-2 block">邮箱</span>
              <input name="email" type="email" required placeholder={`${role.toLowerCase()}@example.com`} />
            </label>
            <label className="text-sm font-bold">
              <span className="mb-2 block">密码</span>
              <input name="password" type="password" required placeholder="Supabase Auth 密码" />
            </label>
            <PrimaryButton disabled={loading}>
              <KeyRound size={17} />
              {loading ? '登录中' : `以 ${role} 登录`}
            </PrimaryButton>
            {error && <p className="text-sm font-bold text-rosehouse-deep md:col-span-3">{error}</p>}
          </form>
        </PinkCard>
      )}
    </div>
  );
}
