'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DoorOpen, KeyRound, UserRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PinkCard } from '@/components/ui/PinkCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { cn } from '@/lib/utils/cn';

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
    <div className="mx-auto grid w-full max-w-3xl gap-4">
      <div className="grid grid-cols-3 gap-3">
        <RoleButton active={selectedRole === 'WY'} label="WY" onClick={() => setSelectedRole('WY')} />
        <RoleButton active={selectedRole === 'YYH'} label="YYH" onClick={() => setSelectedRole('YYH')} />
        <button
          onClick={() => router.push('/guest-request')}
          className="love-card flex min-h-28 flex-col items-center justify-center gap-3 p-4 text-center transition hover:-translate-y-1 hover:bg-white/90"
        >
          <DoorOpen className="text-rosehouse-deep" size={24} />
          <span className="text-lg font-black">访客</span>
        </button>
      </div>

      {selectedRole && (
        <PinkCard>
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
              {loading ? '登录中' : '登录'}
            </PrimaryButton>
            {error && <p className="whitespace-pre-line text-sm font-bold text-rosehouse-deep md:col-span-3">{error}</p>}
          </form>
        </PinkCard>
      )}
    </div>
  );
}

function RoleButton({ active, label, onClick }: { active: boolean; label: 'WY' | 'YYH'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'love-card flex min-h-28 flex-col items-center justify-center gap-3 p-4 text-center transition hover:-translate-y-1 hover:bg-white/90',
        active && 'bg-white/95 ring-2 ring-rosehouse-deep'
      )}
    >
      <UserRound className="text-rosehouse-deep" size={24} />
      <span className="text-lg font-black">{label}</span>
    </button>
  );
}
