import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types';

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle<Profile>();
  if (error) {
    console.error('Failed to load profile for current user:', error);
    return null;
  }

  if (!profile) return null;

  return { user, profile };
}

export async function requireOwner() {
  const current = await getCurrentUser();
  if (!current || !['WY', 'YYH'].includes(current.profile.role)) redirect('/login');
  return current;
}
