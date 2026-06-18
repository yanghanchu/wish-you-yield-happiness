'use client';

import { useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { compressImageIfNeeded, formatFileSize } from '@/lib/utils/compressImageIfNeeded';

export type UploadedImage = {
  image_url: string;
  storage_path: string;
  original_size: number;
  uploaded_size: number;
};

type Props = {
  name?: string;
  prefix: 'records' | 'album' | 'wishes';
  multiple?: boolean;
  required?: boolean;
  label: string;
};

export function ImageUploadField({ name = 'uploaded_images', prefix, multiple = false, required = false, label }: Props) {
  const [items, setItems] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setError('');

    try {
      const supabase = createClient();
      const uploaded: UploadedImage[] = [];

      for (const file of files) {
        const compressed = await compressImageIfNeeded(file);
        const extension = extensionFor(compressed);
        const storagePath = `${prefix}/${crypto.randomUUID()}/${Date.now()}.${extension}`;
        const { data, error: uploadError } = await supabase.storage
          .from('love-house')
          .upload(storagePath, compressed, {
            cacheControl: '3600',
            contentType: compressed.type,
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage.from('love-house').getPublicUrl(data.path);
        uploaded.push({
          image_url: publicUrl.publicUrl,
          storage_path: data.path,
          original_size: file.size,
          uploaded_size: compressed.size
        });
      }

      setItems((current) => (multiple ? [...current, ...uploaded] : uploaded.slice(0, 1)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '图片上传失败，请稍后再试');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  function remove(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="grid gap-3 md:col-span-2">
      <label className="text-sm font-bold">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-pink-200 bg-white/70 p-5 text-center text-sm font-bold text-rosehouse-muted">
        {uploading ? <Loader2 className="mb-2 animate-spin text-rosehouse-deep" /> : <ImagePlus className="mb-2 text-rosehouse-deep" />}
        {uploading ? '正在压缩并上传...' : multiple ? '选择一张或多张图片' : '选择图片'}
        <input className="hidden" type="file" accept="image/*" multiple={multiple} required={required && items.length === 0} onChange={onChange} />
      </label>
      {error && <p className="text-sm font-bold text-rosehouse-deep">{error}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <div key={item.storage_path} className="rounded-3xl bg-white/75 p-3 ring-1 ring-pink-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt="uploaded preview" className="aspect-video w-full rounded-2xl object-cover" />
            <div className="mt-3 flex items-start justify-between gap-3">
              <p className="text-xs font-bold text-rosehouse-muted">
                原图 {formatFileSize(item.original_size)}，压缩后 {formatFileSize(item.uploaded_size)}
              </p>
              <button type="button" onClick={() => remove(index)} className="rounded-full bg-pink-100 p-1 text-rosehouse-deep" aria-label="移除图片">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function extensionFor(file: File) {
  if (file.type === 'image/webp') return 'webp';
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/gif') return 'gif';
  return 'jpg';
}
