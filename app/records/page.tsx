import Link from 'next/link';
import { Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { RecordsExplorer } from '@/components/records/RecordsExplorer';
import { requireOwner } from '@/lib/auth/getCurrentUser';
import { getTable } from '@/lib/db/queries';
import type { LoveRecord } from '@/lib/types';

export default async function RecordsPage() {
  const { profile } = await requireOwner();
  const records = await getTable<LoveRecord>('love_records');

  return (
    <AppLayout profile={profile}>
      <PageHeader
        title="恋爱记录"
        action={
          <Link href="/records/new" className="primary-button">
            <Plus size={17} />
            新增记录
          </Link>
        }
      />
      {records.length ? <RecordsExplorer records={records} /> : <EmptyState title="还没有记录" text="写下第一条恋爱日常吧。" />}
    </AppLayout>
  );
}
