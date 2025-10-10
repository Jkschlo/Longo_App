// lib/supabase.js
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Using your new project credentials (directly to avoid env hiccups)
const url = 'https://uxetzyaeztaiolpjpivb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4ZXR6eWFlenRhaW9scGpwaXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwODI3MTUsImV4cCI6MjA3NTY1ODcxNX0.8_UEZqFRXnpu7WR89QIcE47aU9RRqrst5GHuCFyt-g0';

// (Optional) sanity checks — safe to remove once you’re set
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) {
  console.warn(`Supabase URL looks unusual: "${url}"`);
}
if (!key || key.length < 40) {
  console.warn('Supabase anon key seems short; double-check it in Settings → API.');
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // required for RN/Expo
  },
});
