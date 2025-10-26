import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://feillinqjchnlizytuco.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlaWxsaW5xamNobmxpenl0dWNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0ODgyMjcsImV4cCI6MjA3NzA2NDIyN30.ke3Fu8cTv7-xaoe_hZDiXJ2N0W8qlBMg6Llgis1rJK4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
