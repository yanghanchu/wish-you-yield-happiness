'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DoorOpen, KeyRound, UserRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PinkCard } from '@/components/ui/PinkCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export function LoginPanel() {
  const [selectedRole, setSelectedRole] = useState<'WY' | 'YYH' | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasSupabaseAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError('');

    if (!hasSupabaseUrl || !hasSupabaseAnonKey) {
      setError('Supabase 环境变量缺失，请检查 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。');
      setLoading(false);
      return;
    }

    if (!selectedRole) {
      setError('请先选择 WY 或 YYH 入口。');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: String(formData.get('email')),
        password: String(formData.get('password'))
      });

      if (signInError) {
        console.error('Supabase login error:', signInError);
        setError(`登录失败：${signInError.message}`);
        return;
      }

      console.log('Supabase login user:', data.user);

      const userId = data.user?.id;
      if (!userId) {
        setError('登录失败：Supabase 没有返回用户信息。');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle<{ role: 'WY' | 'YYH' }>();

      if (profileError) {
        console.error('Supabase profile query error:', profileError);
        setError('登录成功，但没有找到对应身份资料，请检查 profiles 表。');
        return;
      }

      if (!profile) {
        console.error('Profile not found for user id:', userId);
        setError('登录成功，但没有找到对应身份资料，请检查 profiles 表。');
        return;
      }

      if (profile.role !== selectedRole) {
        setError(`账号身份与当前入口不匹配。\n当前入口：${selectedRole}\n账号身份：${profile.role}`);
        return;
      }

      router.push('/');
      router.refresh();
    } catch (cause) {
      console.error('Supabase login error:', cause);
      setError(cause instanceof Error ? `登录失败：${cause.message}` : '登录失败：未知错误。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {(['WY', 'YYH'] as const).map((item) => (
        <button
          key={item}
          onClick={() => setSelectedRole(item)}
          className="love-card p-6 text-left transition hover:-translate-y-1 hover:bg-white/90"
        >
          <UserRound className="text-rosehouse-deep" />
          <h2 className="mt-4 text-2xl font-black">{item}</h2>
          <p className="mt-2 text-sm text-rosehouse-muted">
            {item === 'WY' ? '进入小屋，继续收藏我们的回忆' : '回到小屋，看看今天的甜蜜'}
          </p>
        </button>
      ))}
      <button
        onClick={() => router.push('/guest-request')}
        className="love-card p-6 text-left transition hover:-translate-y-1 hover:bg-white/90"
      >
        <DoorOpen className="text-rosehouse-deep" />
        <h2 className="mt-4 text-2xl font-black">访客访问</h2>
        <p className="mt-2 text-sm text-rosehouse-muted">申请参观公开的小屋内容</p>
      </button>

      {selectedRole && (
        <PinkCard className="md:col-span-3">
          <form action={onSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <label className="text-sm font-bold">
              <span className="mb-2 block">邮箱</span>
              <input name="email" type="email" required placeholder={`${selectedRole.toLowerCase()}@example.com`} />
            </label>
            <label className="text-sm font-bold">
              <span className="mb-2 block">密码</span>
              <input name="password" type="password" required placeholder="Supabase Auth 密码" />
            </label>
            <PrimaryButton disabled={loading}>
              <KeyRound size={17} />
              {loading ? '登录中' : `以 ${selectedRole} 登录`}
            </PrimaryButton>
            <div className="rounded-2xl bg-white/70 p-3 text-xs font-bold text-rosehouse-muted md:col-span-3">
              <p>NEXT_PUBLIC_SUPABASE_URL exists: {String(hasSupabaseUrl)}</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY exists: {String(hasSupabaseAnonKey)}</p>
            </div>
            {error && <p className="whitespace-pre-line text-sm font-bold text-rosehouse-deep md:col-span-3">{error}</p>}
          </form>
        </PinkCard>
      )}
    </div>
  );
}
