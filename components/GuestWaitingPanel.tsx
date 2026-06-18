'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

type Status = { status: 'pending' | 'approved' | 'rejected' | 'expired'; accessToken?: string };

export function GuestWaitingPanel({ requestId }: { requestId: string }) {
  const [data, setData] = useState<Status>({ status: 'pending' });

  async function refresh() {
    const res = await fetch(`/api/guest/status?requestId=${requestId}`);
    if (res.ok) setData(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="love-card mx-auto max-w-2xl p-8 text-center">
      {data.status === 'pending' && (
        <>
          <h1 className="text-3xl font-black">正在等待 WY 或 YYH 确认中</h1>
          <p className="mt-3 text-rosehouse-muted">申请已送达小屋主人，请稍后刷新查看结果。</p>
          <div className="mt-6 flex justify-center gap-3"><PrimaryButton onClick={refresh}><RefreshCw size={17} />刷新状态</PrimaryButton><Link className="secondary-button" href="/login">返回登录页</Link></div>
        </>
      )}
      {data.status === 'approved' && (
        <>
          <h1 className="text-3xl font-black">访问申请已通过</h1>
          <p className="mt-3 text-rosehouse-muted">欢迎来参观公开的小屋内容。</p>
          <Link className="primary-button mt-6" href={`/guest/access?token=${data.accessToken}`}>进入 Wish You, Yield Happiness</Link>
        </>
      )}
      {(data.status === 'rejected' || data.status === 'expired') && (
        <>
          <h1 className="text-3xl font-black">很抱歉，这次访问没有通过</h1>
          <p className="mt-3 text-rosehouse-muted">你可以回到登录页重新提交申请。</p>
          <Link className="secondary-button mt-6" href="/login">返回登录页</Link>
        </>
      )}
    </div>
  );
}
