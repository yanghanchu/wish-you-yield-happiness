import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { WishCards } from '@/components/ContentCards';
import { WishForm } from '@/components/Forms';
import { requireOwner } from '@/lib/auth/getCurrentUser';
import { createClient } from '@/lib/supabase/server';
import type { Wish } from '@/lib/types';

export default async function WishlistPage() {
  const { profile } = await requireOwner();
  const supabase = await createClient();
  const { data } = await supabase.from('wishes').select('*').order('created_at', { ascending: false }).returns<Wish[]>();
  const wishes = data ?? [];
  return (
    <AppLayout profile={profile}>
      <PageHeader title="愿望清单" subtitle="把想一起做的事慢慢实现" />
      <WishForm role={profile.role} />
      {wishes.length ? <WishCards wishes={wishes} canEdit /> : <EmptyState title="还没有愿望" text="先写下一个想一起完成的小目标。" />}
    </AppLayout>
  );
}
