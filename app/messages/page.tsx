import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { MessageCards } from '@/components/ContentCards';
import { MessageForm } from '@/components/Forms';
import { requireOwner } from '@/lib/auth/getCurrentUser';
import { createClient } from '@/lib/supabase/server';
import type { MessageNote } from '@/lib/types';

export default async function MessagesPage() {
  const { profile } = await requireOwner();
  const supabase = await createClient();
  const { data } = await supabase.from('message_notes').select('*').order('is_pinned', { ascending: false }).order('date', { ascending: false }).returns<MessageNote[]>();
  const messages = data ?? [];
  return (
    <AppLayout profile={profile}>
      <PageHeader title="留言墙" subtitle="那些想对你说的小话" />
      <MessageForm role={profile.role} />
      {messages.length ? <MessageCards messages={messages} canEdit /> : <EmptyState title="留言墙还很安静" text="写一张粉色、紫色或奶油色便签。" />}
    </AppLayout>
  );
}
