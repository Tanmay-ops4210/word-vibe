import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zeugrghzdfrqpmjjaleo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpldWdyZ2h6ZGZycXBtamphbGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0Nzc0MzAsImV4cCI6MjA3NTA1MzQzMH0.513y70b_k3XwnxgTLdkDLSyeVYNYK53zJ73IZ5fYyhs";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});