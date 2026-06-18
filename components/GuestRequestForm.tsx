'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export function GuestRequestForm() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function submit(formData: FormData) {
    setError('');
    const res = await fetch('/api/guest/request', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        guestName: formData.get('guestName'),
        reason: formData.get('reason')
      })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? '提交失败，请稍后再试');
      return;
    }
    router.push(`/guest-waiting?requestId=${data.requestId}`);
  }

  return (
    <form action={submit} className="love-card mx-auto grid max-w-2xl gap-4 p-6">
      <label className="text-sm font-bold">你的名字<input name="guestName" required /></label>
      <label className="text-sm font-bold">访问理由<textarea name="reason" required rows={5} /></label>
      {error && <p className="text-sm font-bold text-rosehouse-deep">{error}</p>}
      <PrimaryButton className="w-fit"><Send size={17} />提交访问申请</PrimaryButton>
    </form>
  );
}
