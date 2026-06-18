import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables. Database integration will be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
