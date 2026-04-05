import { createClient } from '@supabase/supabase-js';

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


export const supabase = createClient(
  supabaseURL,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: true,      // Auto-refresh tokens
      persistSession: true,         // Save session sa localStorage
      detectSessionInUrl: true      // For email confirmations, etc.
    }
  }
);