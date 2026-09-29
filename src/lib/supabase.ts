import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mmxrzxehypcmjqdyokry.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1teHJ6eGVoeXBjbWpxZHlva3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NTA2NDksImV4cCI6MjEwNjIyNjY0OX0.q0MFWYvd3P_fgaT1zIRirVmg5y6Y16SipDc5W-32eZo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
