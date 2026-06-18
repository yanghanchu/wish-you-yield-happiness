'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth/getCurrentUser';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { generateGuestAccessToken } from '@/lib/utils/token';
import { todayIso } from '@/lib/utils/dates';

type UploadedImage = {
  image_url: string;
  storage_path: string;
};

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === 'string' ? item.trim() : '';
}

function tags(formData: FormData) {
  return value(formData, 'tags')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function uploadedImages(formData: FormData) {
  const raw = value(formData, 'uploaded_images');
  if (!raw) return [] as UploadedImage[];

  try {
    const parsed = JSON.parse(raw) as UploadedImage[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item.image_url && item.storage_path);
  } catch {
    return [];
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function updateSettings(formData: FormData) {
  await requireOwner();
  const supabase = await createClient();
  await supabase
    .from('app_settings')
    .update({
      site_title: value(formData, 'site_title'),
      couple_name: value(formData, 'couple_name'),
      wy_display_name: value(formData, 'wy_display_name'),
      yyh_display_name: value(formData, 'yyh_display_name'),
      start_date: value(formData, 'start_date'),
      allow_guest_request: formData.get('allow_guest_request') === 'on'
    })
    .eq('id', value(formData, 'id'));
  revalidatePath('/');
  revalidatePath('/settings');
}

export async function approveGuestRequest(formData: FormData) {
  const { user, profile } = await requireOwner();
  const admin = createAdminClient();
  const token = generateGuestAccessToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await admin
    .from('guest_requests')
    .update({
      status: 'approved',
      access_token: token,
      token_expires_at: expires,
      approved_by: user.id,
      approved_by_role: profile.role,
      approved_at: new Date().toISOString()
    })
    .eq('id', value(formData, 'id'));

  revalidatePath('/settings');
}

export async function rejectGuestRequest(formData: FormData) {
  const { user, profile } = await requireOwner();
  const admin = createAdminClient();
  await admin
    .from('guest_requests')
    .update({
      status: 'rejected',
      rejected_by: user.id,
      rejected_by_role: profile.role,
      rejected_at: new Date().toISOString()
    })
    .eq('id', value(formData, 'id'));
  revalidatePath('/settings');
}

export async function upsertRecord(formData: FormData) {
  const { user, profile } = await requireOwner();
  const supabase = await createClient();
  let recordId = value(formData, 'id');
  const payload = {
    title: value(formData, 'title'),
    content: value(formData, 'content'),
    date: value(formData, 'date') || todayIso(),
    author_role: (value(formData, 'author_role') || profile.role) as 'WY' | 'YYH',
    mood: value(formData, 'mood') || null,
    tags: tags(formData),
    is_favorite: formData.get('is_favorite') === 'on',
    visibility: value(formData, 'visibility') || 'private',
    updated_by: user.id
  };

  if (recordId) {
    await supabase.from('love_records').update(payload).eq('id', recordId);
  } else {
    const { data } = await supabase
      .from('love_records')
      .insert({ ...payload, created_by: user.id })
      .select('id')
      .single();
    recordId = data?.id ?? '';
  }

  const images = uploadedImages(formData);
  if (recordId && images.length) {
    await supabase.from('record_images').insert(
      images.map((image, index) => ({
        record_id: recordId,
        image_url: image.image_url,
        storage_path: image.storage_path,
        sort_order: index
      }))
    );
  }

  revalidatePath('/records');
  redirect('/records');
}

export async function deleteById(formData: FormData) {
  await requireOwner();
  const supabase = await createClient();
  const table = value(formData, 'table');
  const path = value(formData, 'path') || '/';
  await supabase.from(table).delete().eq('id', value(formData, 'id'));
  revalidatePath(path);
}

export async function createPhoto(formData: FormData) {
  const { user, profile } = await requireOwner();
  const supabase = await createClient();
  const [image] = uploadedImages(formData);
  if (!image) throw new Error('Please upload an image before saving.');

  await supabase.from('album_photos').insert({
    image_url: image.image_url,
    storage_path: image.storage_path,
    caption: value(formData, 'caption') || null,
    date: value(formData, 'date') || todayIso(),
    author_role: value(formData, 'author_role') || profile.role,
    category: value(formData, 'category') || '日常',
    visibility: value(formData, 'visibility') || 'private',
    created_by: user.id
  });
  revalidatePath('/album');
}

export async function createAnniversary(formData: FormData) {
  const { user } = await requireOwner();
  const supabase = await createClient();
  await supabase.from('anniversaries').insert({
    title: value(formData, 'title'),
    date: value(formData, 'date'),
    type: value(formData, 'type') || '自定义',
    repeat: value(formData, 'repeat') || 'none',
    note: value(formData, 'note') || null,
    visibility: value(formData, 'visibility') || 'private',
    created_by: user.id
  });
  revalidatePath('/anniversaries');
}

export async function createWish(formData: FormData) {
  const { user, profile } = await requireOwner();
  const supabase = await createClient();
  const { data } = await supabase
    .from('wishes')
    .insert({
      title: value(formData, 'title'),
      description: value(formData, 'description') || null,
      status: value(formData, 'status') || 'todo',
      target_date: value(formData, 'target_date') || null,
      creator_role: value(formData, 'creator_role') || profile.role,
      completed_date: value(formData, 'completed_date') || null,
      completed_note: value(formData, 'completed_note') || null,
      visibility: value(formData, 'visibility') || 'private',
      created_by: user.id
    })
    .select('id')
    .single();

  const images = uploadedImages(formData);
  if (data?.id && images.length) {
    await supabase.from('wish_images').insert(
      images.map((image, index) => ({
        wish_id: data.id,
        image_url: image.image_url,
        storage_path: image.storage_path,
        sort_order: index
      }))
    );
  }

  revalidatePath('/wishlist');
}

export async function createMessage(formData: FormData) {
  const { user, profile } = await requireOwner();
  const supabase = await createClient();
  await supabase.from('message_notes').insert({
    content: value(formData, 'content'),
    author_role: value(formData, 'author_role') || profile.role,
    date: value(formData, 'date') || todayIso(),
    theme: value(formData, 'theme') || 'pink',
    is_pinned: formData.get('is_pinned') === 'on',
    visibility: value(formData, 'visibility') || 'private',
    created_by: user.id
  });
  revalidatePath('/messages');
}
