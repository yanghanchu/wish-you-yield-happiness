import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { AnniversaryCards } from '@/components/ContentCards';
import { AnniversaryForm } from '@/components/Forms';
import { requireOwner } from '@/lib/auth/getCurrentUser';
import { getTable } from '@/lib/db/queries';
import type { Anniversary } from '@/lib/types';

export default async function AnniversariesPage() {
  const { profile } = await requireOwner();
  const items = await getTable<Anniversary>('anniversaries');
  return (
    <AppLayout profile={profile}>
      <PageHeader title="纪念日" subtitle="重要的日子要被好好记住" />
      <AnniversaryForm />
      {items.length ? <AnniversaryCards items={items} canEdit /> : <EmptyState title="还没有纪念日" text="添加在一起、生日、节日或其他专属日子。" />}
    </AppLayout>
  );
}
