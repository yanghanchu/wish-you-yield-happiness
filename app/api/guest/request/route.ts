import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const guestName = String(body?.guestName ?? '').trim();
  const reason = String(body?.reason ?? '').trim();

  if (!guestName || !reason) {
    return NextResponse.json({ error: '请填写名字和访问理由' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: settings } = await supabase.from('app_settings').select('allow_guest_request').limit(1).single();
  if (settings && !settings.allow_guest_request) {
    return NextResponse.json({ error: '当前暂不开放访客申请' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('guest_requests')
    .insert({ guest_name: guestName, reason, status: 'pending' })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, requestId: data.id });
}
