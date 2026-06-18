import Link from 'next/link';
import { Plus, Users } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { PinkCard } from '@/components/ui/PinkCard';
import { requireOwner } from '@/lib/auth/getCurrentUser';
import { getOwnerDashboardData } from '@/lib/db/queries';
import { calculateLoveDays, getNextAnniversary, calculateDaysUntil } from '@/lib/utils/dates';

export default async function HomePage() {
  const { profile } = await requireOwner();
  const data = await getOwnerDashboardData();
  const settings = data.settings;
  const next = getNextAnniversary(data.anniversaries);

  return (
    <AppLayout profile={profile}>
      <PageHeader title="我们的恋爱小屋" subtitle="把日常、照片、愿望和悄悄话都温柔收好" action={<Link className="primary-button" href="/records/new"><Plus size={17} />写新记录</Link>} />
      <div className="grid gap-5 md:grid-cols-3">
        <PinkCard><p className="text-sm font-bold text-rosehouse-muted">已经在一起</p><p className="mt-3 text-5xl font-black text-rosehouse-deep">{settings ? calculateLoveDays(settings.start_date) : '--'} 天</p></PinkCard>
        <PinkCard><p className="text-sm font-bold text-rosehouse-muted">下一件重要的事</p><p className="mt-3 text-2xl font-black">{next?.title ?? '还没有纪念日'}</p>{next && <p className="mt-2 text-rosehouse-deep">还有 {calculateDaysUntil(next.date, next.repeat)} 天</p>}</PinkCard>
        <PinkCard><p className="text-sm font-bold text-rosehouse-muted">待审核访客</p><p className="mt-3 text-5xl font-black text-rosehouse-deep">{data.guestRequests.filter((item) => item.status === 'pending').length}</p><Link href="/settings" className="mt-3 inline-flex items-center gap-2 text-sm font-bold"><Users size={16} />去审核</Link></PinkCard>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <PinkCard><h2 className="text-xl font-black">最近记录</h2>{data.records.slice(0, 4).map((item) => <p className="mt-3 text-sm" key={item.id}>{item.date} · {item.title}</p>)}</PinkCard>
        <PinkCard><h2 className="text-xl font-black">最近留言</h2>{data.messages.slice(0, 4).map((item) => <p className="mt-3 text-sm" key={item.id}>{item.author_role}：{item.content}</p>)}</PinkCard>
      </div>
    </AppLayout>
  );
}
