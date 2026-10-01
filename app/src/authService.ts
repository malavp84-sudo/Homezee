// Auth adapter. Uses real Supabase phone-OTP when EXPO_PUBLIC_SUPABASE_URL and
// EXPO_PUBLIC_SUPABASE_ANON_KEY are set; otherwise falls back to a demo (OTP 123456).
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const LIVE = !!(URL && KEY);
export const MOCK_OTP = '123456';

const supabase = LIVE
  ? createClient(URL!, KEY!, { auth: { storage: AsyncStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } })
  : null;

const validPhone = (p: string) => /^[6-9]\d{9}$/.test(p);

export async function sendOtp(phone: string): Promise<void> {
  if (!validPhone(phone)) throw new Error('Enter a valid 10-digit mobile number');
  if (!supabase) {
    await new Promise((r) => setTimeout(r, 600));
    return;
  }
  const { error } = await supabase.auth.signInWithOtp({ phone: '+91' + phone });
  if (error) throw new Error(error.message);
}

export async function verifyOtp(phone: string, code: string): Promise<{ phone: string }> {
  if (!supabase) {
    await new Promise((r) => setTimeout(r, 600));
    if (code !== MOCK_OTP) throw new Error('Wrong code. Please try again.');
    return { phone };
  }
  const { error } = await supabase.auth.verifyOtp({ phone: '+91' + phone, token: code, type: 'sms' });
  if (error) throw new Error(error.message);
  return { phone };
}

export async function signOut(): Promise<void> {
  await supabase?.auth.signOut();
}
