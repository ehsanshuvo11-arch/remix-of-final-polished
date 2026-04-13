import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tvbnnqmffqtyhgtpwqri.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Ym5ucW1mZnF0eWhndHB3cXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzk4NzAsImV4cCI6MjA5MDgxNTg3MH0.uXnLVmHtVbJy-BytdjG_jCzN0aH8BAXVceqmyKMzjNc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
