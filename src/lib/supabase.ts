import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dumxztpjkmruzbnlfnne.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bXh6dHBqa21ydXpibmxmbm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5ODcxNDIsImV4cCI6MjA5MTU2MzE0Mn0.alsQlwO-f14Ke7txfNZ_MLOVTpA5fHToA9oq7yOuQ3Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
