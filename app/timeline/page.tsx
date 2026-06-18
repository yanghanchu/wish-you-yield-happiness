import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { TimelineList } from '@/components/ContentCards';
import { requireOwner } from '@/lib/auth/getCurrentUser';
import { getOwnerDashboardData } from '@/lib/db/queries';

export default async function TimelinePage() {
  const { profile } = await requireOwner();
  const data = await getOwnerDashboardData();
  return (
    <AppLayout profile={profile}>
      <PageHeader title="我们的时间线" subtitle="故事正在一点点变长" />
      <TimelineList records={data.records} anniversaries={data.anniversaries} wishes={data.wishes} messages={data.messages} />
    </AppLayout>
  );
}
