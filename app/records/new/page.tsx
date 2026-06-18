import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { RecordForm } from '@/components/Forms';
import { requireOwner } from '@/lib/auth/getCurrentUser';

export default async function NewRecordPage() {
  const { profile } = await requireOwner();
  return (
    <AppLayout profile={profile}>
      <PageHeader title="新增恋爱记录" subtitle="新的回忆默认只对 WY 和 YYH 可见" />
      <RecordForm role={profile.role} />
    </AppLayout>
  );
}
