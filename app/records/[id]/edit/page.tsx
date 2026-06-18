import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { RecordForm } from '@/components/Forms';
import { requireOwner } from '@/lib/auth/getCurrentUser';
import { createClient } from '@/lib/supabase/server';
import type { LoveRecord } from '@/lib/types';

export default async function EditRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOwner();
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('love_records').select('*').eq('id', id).single<LoveRecord>();
  if (!data) notFound();
  return (
    <AppLayout profile={profile}>
      <PageHeader title="编辑恋爱记录" subtitle="可以修改正文、收藏和公开状态" />
      <RecordForm role={profile.role} record={data} />
    </AppLayout>
  );
}
