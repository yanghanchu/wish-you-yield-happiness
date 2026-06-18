import { createClient } from '@/lib/supabase/server';
import type { AlbumPhoto, Anniversary, AppSettings, GuestRequest, LoveRecord, MessageNote, Wish } from '@/lib/types';

export async function getSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from('app_settings').select('*').limit(1).single<AppSettings>();
  return data;
}

export async function getOwnerDashboardData() {
  const supabase = await createClient();
  const [settings, records, photos, anniversaries, wishes, messages, guestRequests] = await Promise.all([
    supabase.from('app_settings').select('*').limit(1).single<AppSettings>(),
    supabase.from('love_records').select('*').order('date', { ascending: false }).returns<LoveRecord[]>(),
    supabase.from('album_photos').select('*').order('date', { ascending: false }).returns<AlbumPhoto[]>(),
    supabase.from('anniversaries').select('*').order('date').returns<Anniversary[]>(),
    supabase.from('wishes').select('*').order('created_at', { ascending: false }).returns<Wish[]>(),
    supabase.from('message_notes').select('*').order('is_pinned', { ascending: false }).order('date', { ascending: false }).returns<MessageNote[]>(),
    supabase.from('guest_requests').select('*').order('created_at', { ascending: false }).returns<GuestRequest[]>()
  ]);

  return {
    settings: settings.data,
    records: records.data ?? [],
    photos: photos.data ?? [],
    anniversaries: anniversaries.data ?? [],
    wishes: wishes.data ?? [],
    messages: messages.data ?? [],
    guestRequests: guestRequests.data ?? []
  };
}

export async function getTable<T>(table: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select('*').order('date', { ascending: false }).returns<T[]>();
  if (error) throw error;
  return data ?? [];
}
