import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { GuestBanner } from '@/components/layout/GuestBanner';
import { PageHeader } from '@/components/layout/PageHeader';
import { RecordCards, PhotoCards, AnniversaryCards, WishCards, MessageCards, TimelineList } from '@/components/ContentCards';
import type { AlbumPhoto, Anniversary, LoveRecord, MessageNote, Wish } from '@/lib/types';
import { getSiteUrl } from '@/lib/env';

type PublicData = {
  records: LoveRecord[];
  photos: AlbumPhoto[];
  anniversaries: Anniversary[];
  wishes: Wish[];
  messages: MessageNote[];
};

export default async function GuestAccessPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  if (!token) notFound();
  const baseUrl = getSiteUrl();
  const res = await fetch(`${baseUrl}/api/guest/public-data?token=${token}`, { cache: 'no-store' });
  if (!res.ok) notFound();
  const data = (await res.json()) as PublicData;

  return (
    <AppLayout guestToken={token}>
      <GuestBanner />
      <PageHeader title="公开的小屋内容" subtitle="这里展示 WY 和 YYH 选择分享给朋友的部分" />
      <div className="space-y-10">
        <section><h2 className="mb-4 text-2xl font-black">恋爱记录</h2><RecordCards records={data.records} canEdit={false} /></section>
        <section><h2 className="mb-4 text-2xl font-black">相册</h2><PhotoCards photos={data.photos} canEdit={false} /></section>
        <section><h2 className="mb-4 text-2xl font-black">纪念日</h2><AnniversaryCards items={data.anniversaries} canEdit={false} /></section>
        <section><h2 className="mb-4 text-2xl font-black">愿望清单</h2><WishCards wishes={data.wishes} canEdit={false} /></section>
        <section><h2 className="mb-4 text-2xl font-black">留言墙</h2><MessageCards messages={data.messages} canEdit={false} /></section>
        <section><h2 className="mb-4 text-2xl font-black">时间线</h2><TimelineList records={data.records} anniversaries={data.anniversaries} wishes={data.wishes} messages={data.messages} /></section>
      </div>
    </AppLayout>
  );
}
