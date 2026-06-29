'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile, UserRole } from '@/lib/types';
import { compressImageIfNeeded, formatFileSize } from '@/lib/utils/compressImageIfNeeded';

type Props = {
  ownerRole: UserRole;
  currentRole: UserRole;
  profile?: Profile;
};

export function AvatarUploader({ ownerRole, currentRole, profile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const canEdit = ownerRole === currentRole && profile?.id;

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !profile?.id) return;

    setUploading(true);
    setMessage('');

    try {
      const compressed = await compressImageIfNeeded(file);
      const supabase = createClient();
      const storagePath = `avatars/${profile.id}/${Date.now()}-${crypto.randomUUID()}.${extensionFor(compressed)}`;

      const { data, error: uploadError } = await supabase.storage.from('love-house').upload(storagePath, compressed, {
        cacheControl: '3600',
        contentType: compressed.type,
        upsert: false
      });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from('love-house').getPublicUrl(data.path);
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl.publicUrl }).eq('id', profile.id);

      if (updateError) throw updateError;

      setMessage(`原图 ${formatFileSize(file.size)}，上传后 ${formatFileSize(compressed.size)}`);
      router.refresh();
    } catch (cause) {
      console.error('Avatar upload error:', cause);
      setMessage(cause instanceof Error ? `上传失败：${cause.message}` : '上传失败，请稍后再试');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative size-36 overflow-hidden rounded-full border-[5px] border-[#3f2f25] bg-[#ffd46c] p-2 shadow-[0_8px_0_rgba(63,47,37,0.12)] md:size-44">
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatar_url} alt={`${ownerRole} 头像`} className="size-full rounded-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center rounded-full bg-[#ffe4a3] text-[#5a3d35]">
            <UserRound size={54} />
          </div>
        )}
        {canEdit && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-x-4 bottom-3 flex items-center justify-center gap-1 rounded-full border-2 border-[#3f2f25] bg-white/95 px-3 py-2 text-xs font-black text-[#4a3329] shadow-[0_3px_0_rgba(63,47,37,0.15)] transition hover:bg-[#f6a052] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {uploading ? <Loader2 className="animate-spin" size={14} /> : <Camera size={14} />}
            {uploading ? '上传中' : '更换'}
          </button>
        )}
      </div>
      <p className="mt-3 text-sm font-black tracking-[0.2em] text-[#9f8a78]">{ownerRole}</p>
      {canEdit && <input ref={inputRef} className="hidden" type="file" accept="image/*" onChange={onChange} />}
      {message && <p className="mt-2 max-w-40 text-center text-xs font-bold text-[#9f8a78]">{message}</p>}
    </div>
  );
}

function extensionFor(file: File) {
  if (file.type === 'image/webp') return 'webp';
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/gif') return 'gif';
  return 'jpg';
}
