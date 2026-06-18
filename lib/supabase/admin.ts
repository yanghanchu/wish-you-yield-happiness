// 只允许在服务端使用，禁止在客户端组件中 import。
// 这里会读取 SUPABASE_SERVICE_ROLE_KEY，不能暴露给浏览器。

import { createClient } from '@supabase/supabase-js';
import { getSupabaseAdminEnv } from '@/lib/env';

export function createAdminClient() {
  const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseAdminEnv();

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
