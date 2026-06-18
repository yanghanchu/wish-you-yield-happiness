import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const requestId = new URL(request.url).searchParams.get('requestId');
  if (!requestId) return NextResponse.json({ error: 'Missing requestId' }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('guest_requests')
    .select('status, access_token, token_expires_at')
    .eq('id', requestId)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

  const expired = data.token_expires_at && new Date(data.token_expires_at).getTime() < Date.now();
  return NextResponse.json({
    status: expired ? 'expired' : data.status,
    accessToken: data.status === 'approved' && !expired ? data.access_token : undefined
  });
}
