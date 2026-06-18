import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { PhotoCards } from '@/components/ContentCards';
import { PhotoForm } from '@/components/Forms';
import { requireOwner } from '@/lib/auth/getCurrentUser';
import { getTable } from '@/lib/db/queries';
import type { AlbumPhoto } from '@/lib/types';

export default async function AlbumPage() {
  const { profile } = await requireOwner();
  const photos = await getTable<AlbumPhoto>('album_photos');
  return (
    <AppLayout profile={profile}>
      <PageHeader title="我们的相册" subtitle="把每一张照片都变成回忆" />
      <PhotoForm role={profile.role} />
      {photos.length ? <PhotoCards photos={photos} canEdit /> : <EmptyState title="相册还是空的" text="添加第一张照片 URL，或者先上传到 Supabase Storage。" />}
    </AppLayout>
  );
}
