import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  const supabase = createAdminClient();
  const { data: guest } = await supabase
    .from('guest_requests')
    .select('status, token_expires_at')
    .eq('access_token', token)
    .single();

  if (!guest || guest.status !== 'approved') return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  if (guest.token_expires_at && new Date(guest.token_expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'Token expired' }, { status: 403 });
  }

  const [settings, records, photos, anniversaries, wishes, messages] = await Promise.all([
    supabase.from('app_settings').select('*').limit(1).single(),
    supabase.from('love_records').select('*').eq('visibility', 'public').order('date', { ascending: false }),
    supabase.from('album_photos').select('*').eq('visibility', 'public').order('date', { ascending: false }),
    supabase.from('anniversaries').select('*').eq('visibility', 'public').order('date'),
    supabase.from('wishes').select('*').eq('visibility', 'public').order('created_at', { ascending: false }),
    supabase.from('message_notes').select('*').eq('visibility', 'public').order('is_pinned', { ascending: false }).order('date', { ascending: false })
  ]);

  return NextResponse.json({
    settings: settings.data,
    records: records.data ?? [],
    photos: photos.data ?? [],
    anniversaries: anniversaries.data ?? [],
    wishes: wishes.data ?? [],
    messages: messages.data ?? []
  });
}
