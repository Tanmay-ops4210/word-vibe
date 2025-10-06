import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Upload = {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  created_at: string;
};
