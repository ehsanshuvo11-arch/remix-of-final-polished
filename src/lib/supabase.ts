import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tvbnnqmffqtyhgtpwqri.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Ym5ucW1mZnF0eWhndHB3cXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzk4NzAsImV4cCI6MjA5MDgxNTg3MH0.uXnLVmHtVbJy-BytdjG_jCzN0aH8BAXVceqmyKMzjNc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
