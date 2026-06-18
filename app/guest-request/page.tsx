import Link from 'next/link';
import { GuestRequestForm } from '@/components/GuestRequestForm';

export default function GuestRequestPage() {
  return (
    <main className="page-shell flex min-h-screen flex-col justify-center py-10">
      <div className="mb-8 text-center">
        <p className="text-sm font-bold text-rosehouse-muted">Wish You, Yield Happiness</p>
        <h1 className="mt-2 text-4xl font-black">申请参观恋爱小屋</h1>
        <p className="mt-4 text-rosehouse-muted">这里只有被允许的朋友可以查看公开内容</p>
        <Link href="/login" className="mt-4 inline-block text-sm font-bold text-rosehouse-deep">返回登录</Link>
      </div>
      <GuestRequestForm />
    </main>
  );
}
